
"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { AppLogo } from '@/components/shared/AppLogo';

export default function BillingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const newSub = searchParams.get('new_sub');

  useEffect(() => {
    if (sessionId && newSub === 'true') {
      // Simular ativação do status Pro
      // Em um app real, você validaria o session_id com o backend e Stripe,
      // e o backend atualizaria o status do usuário no banco de dados via webhook.
      try {
        localStorage.setItem('memetrade_user_is_pro_simulated', 'true');
        console.log("Status Pro simulado ativado no localStorage.");
      } catch (error) {
        console.error("Erro ao tentar definir memetrade_user_is_pro_simulated no localStorage:", error);
      }
    }

    // Redirecionar após um tempo
    const timer = setTimeout(() => {
      router.push('/dashboard/billing'); // Ou para /dashboard
    }, 5000); // 5 segundos

    return () => clearTimeout(timer);
  }, [sessionId, newSub, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <AppLogo />
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-headline">Pagamento Bem-Sucedido!</CardTitle>
          <CardDescription>
            Sua assinatura do MemeTrade Pro foi ativada.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Obrigado por se juntar à comunidade Pro! Você agora tem acesso a todos os recursos premium.
          </p>
          <div className="flex items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Você será redirecionado em alguns segundos...
          </div>
          <Button variant="link" asChild>
            <Link href="/dashboard/billing">Voltar para Faturamento Agora</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
