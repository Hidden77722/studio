
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLogo } from "@/components/shared/AppLogo";
import Link from "next/link";
import React, { useEffect, useState, FormEvent } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, AuthError } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, LogIn, Mail, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleEmailPasswordSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Auth state change will be caught by useAuth hook and redirect
    } catch (e) {
      const authError = e as AuthError;
      console.error("Email/Password Sign-In Error:", authError);
      let friendlyMessage = "Falha ao fazer login. Verifique seu email e senha.";
      switch (authError.code) {
        case 'auth/invalid-email':
          friendlyMessage = "O formato do email é inválido.";
          break;
        case 'auth/user-disabled':
          friendlyMessage = "Este usuário foi desabilitado.";
          break;
        // Newer SDKs might use 'auth/invalid-credential' for both user-not-found and wrong-password
        case 'auth/user-not-found': // Specific to older SDKs or particular error responses
        case 'auth/wrong-password': // Specific to older SDKs or particular error responses
        case 'auth/invalid-credential': // General invalid credential error
          friendlyMessage = "Credenciais inválidas. Verifique seu email e senha.";
          break;
        case 'auth/too-many-requests':
           friendlyMessage = "Acesso temporariamente desabilitado devido a muitas tentativas de login malsucedidas. Tente novamente mais tarde.";
           break;
      }
      setError(friendlyMessage);
      setIsSigningIn(false);
    }
  };

  if (authLoading || (!authLoading && user)) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
            <AppLogo />
             <div className="mt-8 flex items-center space-x-2">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg text-muted-foreground">Verificando sessão...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <AppLogo />
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline flex items-center justify-center">
            <LogIn className="mr-2 h-6 w-6" /> Acesso à Plataforma
          </CardTitle>
          <CardDescription>
            Use seu email e senha para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro no Login</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleEmailPasswordSignIn} className="space-y-4">
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
                  disabled={isSigningIn}
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
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                  disabled={isSigningIn}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSigningIn}
            >
              {isSigningIn ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <LogIn className="mr-2 h-5 w-5" />
              )}
              {isSigningIn ? "Entrando..." : "Entrar com Email"}
            </Button>
          </form>

           <p className="text-xs text-muted-foreground text-center px-4">
            Ao continuar, você concorda com nossos <Link href="#" className="underline hover:text-primary">Termos de Serviço</Link> e <Link href="#" className="underline hover:text-primary">Política de Privacidade</Link>.
          </p>
        </CardContent>
        <CardFooter className="text-center text-sm flex-col items-center space-y-2">
           <p className="text-muted-foreground">
            Não tem uma conta? <Link href="#" className="underline hover:text-primary">Registre-se aqui</Link> (funcionalidade a ser implementada).
          </p>
          <Link href="#" className="text-xs text-primary hover:underline">Esqueceu sua senha?</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
