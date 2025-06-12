
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLogo } from "@/components/shared/AppLogo";
import Link from "next/link";
import React, { useEffect } from "react";
// Firebase imports for auth state checking are still relevant if the user is already logged in.
// import { auth } from "@/lib/firebase"; 
// import { GoogleAuthProvider, signInWithPopup, AuthError } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, LogIn } from "lucide-react";

export default function LoginPage() {
  // const [isSigningIn, setIsSigningIn] = React.useState(false); // No longer needed
  const [error, setError] = React.useState<string | null>(null); // Keep for general errors if any arise
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  // handleGoogleSignIn function removed

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
            O método de login anterior (Google) foi removido. <br />
            No momento, não há um método de login ativo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           {error && ( // Kept for potential future use or general errors
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="text-center text-muted-foreground p-4 border border-dashed rounded-md">
            <p>Funcionalidade de login em desenvolvimento ou temporariamente indisponível.</p>
            <p className="text-xs mt-2">Por favor, contate o suporte se precisar de acesso.</p>
          </div>
           <p className="text-xs text-muted-foreground text-center px-4">
            O uso da plataforma está sujeito aos nossos <Link href="#" className="underline hover:text-primary">Termos de Serviço</Link> e <Link href="#" className="underline hover:text-primary">Política de Privacidade</Link>.
          </p>
        </CardContent>
        <CardFooter className="text-center text-sm">
        </CardFooter>
      </Card>
    </div>
  );
}
