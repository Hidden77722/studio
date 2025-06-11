
import Link from 'next/link';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DeprecatedTwitterFeedPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center">Página Removida</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-muted-foreground">
            A funcionalidade "Feed de MemeCoins" foi substituída pela página "Influenciadores".
          </p>
          <Link href="/dashboard/influencers" className="text-primary hover:underline font-medium">
            Ir para a página de Influenciadores
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
