
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLogo } from "@/components/shared/AppLogo";
import Link from "next/link";
import React, { useState, FormEvent } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, AuthError } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, LogIn, Mail, KeyRound, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailPasswordSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsSigningUp(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccessMessage("Conta criada com sucesso! Você será redirecionado para o login.");
      // Ideally, redirect to dashboard or send verification email
      // For now, redirect to login after a short delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (e) {
      const authError = e as AuthError;
      console.error("Email/Password Sign-Up Error:", authError.code, authError.message);
      let friendlyMessage = "Falha ao criar conta. Tente novamente.";
      switch (authError.code) {
        case 'auth/email-already-in-use':
          friendlyMessage = "Este endereço de email já está em uso.";
          break;
        case 'auth/invalid-email':
          friendlyMessage = "O formato do email é inválido.";
          break;
        case 'auth/weak-password':
          friendlyMessage = "A senha é muito fraca. Use pelo menos 6 caracteres.";
          break;
        default:
          friendlyMessage = "Ocorreu um erro desconhecido ao tentar criar a conta.";
      }
      setError(friendlyMessage);
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <AppLogo />
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline flex items-center justify-center">
            <UserPlus className="mr-2 h-6 w-6" /> Criar Nova Conta
          </CardTitle>
          <CardDescription>
            Preencha os campos abaixo para se registrar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro no Registro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert variant="default" className="bg-green-500/10 border-green-500/30 text-green-400">
              <UserPlus className="h-4 w-4 text-green-400" />
              <AlertTitle>Sucesso!</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {!successMessage && (
            <form onSubmit={handleEmailPasswordSignUp} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    disabled={isSigningUp}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Crie uma senha (mín. 6 caracteres)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                    disabled={isSigningUp}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10"
                    disabled={isSigningUp}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <UserPlus className="mr-2 h-5 w-5" />
                )}
                {isSigningUp ? "Registrando..." : "Registrar com Email"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="text-center text-sm flex-col items-center space-y-2">
          <p className="text-muted-foreground">
            Já tem uma conta? <Link href="/auth/login" className="underline hover:text-primary">Faça login aqui</Link>.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
