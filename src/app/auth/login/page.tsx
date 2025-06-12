
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLogo } from "@/components/shared/AppLogo";
import Link from "next/link";
import React, { useEffect } from "react";
import { auth } from "@/lib/firebase"; 
import { GoogleAuthProvider, signInWithPopup, AuthError } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, LogIn } from "lucide-react";

// Import a Google icon (you might need to install 'lucide-react' or similar)
// For this example, I'll use a simple text prefix or an SVG if you prefer.
// Let's assume you have a way to show a Google icon or just use text.

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);


export default function LoginPage() {
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Auth state change will be caught by useAuth hook and redirect
    } catch (e) {
      const authError = e as AuthError;
      console.error("Google Sign-In Error:", authError);
      if (authError.code === 'auth/popup-closed-by-user') {
        setError("Login cancelado. A janela de login foi fechada.");
      } else if (authError.code === 'auth/cancelled-popup-request') {
        setError("Login cancelado. Múltiplas janelas de login abertas.");
      } else {
        setError(authError.message || "Falha ao fazer login com Google. Tente novamente.");
      }
      setIsSigningIn(false);
    }
    // setIsSigningIn will be set to false by the useEffect redirect or error handling
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
            Use sua conta Google para acessar o MemeTrade Pro.
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
          <Button 
            onClick={handleGoogleSignIn} 
            className="w-full" 
            disabled={isSigningIn}
            variant="outline"
          >
            {isSigningIn ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <GoogleIcon />
            )}
            {isSigningIn ? "Autenticando..." : "Entrar com Google"}
          </Button>
           <p className="text-xs text-muted-foreground text-center px-4">
            Ao continuar, você concorda com nossos <Link href="#" className="underline hover:text-primary">Termos de Serviço</Link> e <Link href="#" className="underline hover:text-primary">Política de Privacidade</Link>.
          </p>
        </CardContent>
        <CardFooter className="text-center text-sm">
           <p className="text-muted-foreground">
            Não tem uma conta? O login com Google criará uma para você.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
