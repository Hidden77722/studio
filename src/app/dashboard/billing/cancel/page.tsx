
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';
import { AppLogo } from '@/components/shared/AppLogo';

export default function BillingCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <AppLogo />
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-headline">Pagamento Cancelado</CardTitle>
          <CardDescription>
            Seu processo de assinatura foi cancelado.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Você não foi cobrado. Se você mudou de ideia ou teve algum problema, pode tentar novamente.
          </p>
          <Button onClick={() => router.push('/dashboard/billing')} className="w-full">
            Voltar para Faturamento
          </Button>
          <Button variant="link" asChild>
            <Link href="/dashboard/support">Contatar Suporte</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
