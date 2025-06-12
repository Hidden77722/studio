
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLogo } from "@/components/shared/AppLogo";
import Link from "next/link";
import React, { useState, FormEvent } from "react";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail, AuthError } from "firebase/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Mail, ChevronLeft, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Se uma conta existir para este email, um link de redefinição de senha foi enviado. Verifique sua caixa de entrada (e spam).");
    } catch (e) {
      const authError = e as AuthError;
      console.error("Password Reset Error:", authError.code, authError.message);
      let friendlyMessage = "Falha ao enviar email de redefinição. Tente novamente.";
      switch (authError.code) {
        case 'auth/invalid-email':
          friendlyMessage = "O formato do email é inválido.";
          break;
        case 'auth/user-not-found':
          // We don't want to reveal if an email exists or not for security reasons
          // So, show a generic success message anyway
          setSuccessMessage("Se uma conta existir para este email, um link de redefinição de senha foi enviado. Verifique sua caixa de entrada (e spam).");
          setIsSending(false);
          return; // Return early as we've set a success message
        case 'auth/too-many-requests':
          friendlyMessage = "Muitas tentativas de redefinição de senha. Tente novamente mais tarde."
          break;
        default:
          friendlyMessage = "Ocorreu um erro desconhecido ao tentar redefinir a senha.";
      }
      setError(friendlyMessage);
    } finally {
      setIsSending(false);
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
            <Mail className="mr-2 h-6 w-6" /> Redefinir Senha
          </CardTitle>
          <CardDescription>
            Insira seu email para receber um link de redefinição.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert variant="default" className="bg-green-500/10 border-green-500/30 text-green-400">
              <Send className="h-4 w-4 text-green-400" />
              <AlertTitle>Email Enviado</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {!successMessage && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
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
                    disabled={isSending}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSending}
              >
                {isSending ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Send className="mr-2 h-5 w-5" />
                )}
                {isSending ? "Enviando..." : "Enviar Link de Redefinição"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="text-center text-sm flex-col items-center space-y-2">
          <Link href="/auth/login" className="text-primary hover:underline flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" /> Voltar para o Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
