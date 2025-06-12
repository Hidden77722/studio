
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, PlusCircle, Edit, Star, ShieldCheck, XCircle, Loader2, AlertTriangle } from "lucide-react";
import React, { useState } from "react"; // Adicionado useState
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; // Import Alert components

// Mock data
const currentPlanMock = {
  name: "Plano Gratuito",
  price: "Grátis",
  renewsOn: "N/A", // Not applicable for a free plan
  status: "Ativo",
};

const paymentMethodsMock = [
  // { id: "pm1", type: "Visa", last4: "4242", expiry: "12/25", isDefault: true },
];

const billingHistoryMock = [
  // { id: "bh1", date: "15 de Janeiro de 2024", description: "Assinatura Anual Pro", amount: "$299.00", status: "Pago" },
];

const availablePlans = [
    {
        name: "Pro Mensal",
        priceString: "$29,99/mês",
        priceInCents: 2999, // Preço em centavos
        currency: "brl",
        stripePriceId: "price_PRO_MONTHLY_PLACEHOLDER", // SUBSTITUA PELO SEU PRICE ID REAL DO STRIPE
        description: "Acesso completo a todos os recursos, cobrado mensalmente.",
        features: [
            "Alertas de trade ilimitados",
            "Análise de IA para cada call",
            "Histórico completo de trades",
            "Pares em Alta (DexScreener)",
            "Suporte prioritário"
        ]
    },
    {
        name: "Pro Anual",
        priceString: "$299,00/ano",
        priceInCents: 29900, // Preço em centavos
        currency: "brl",
        stripePriceId: "price_PRO_YEARLY_PLACEHOLDER", // SUBSTITUA PELO SEU PRICE ID REAL DO STRIPE
        description: "Economize com o plano anual! Acesso completo a todos os recursos.",
        features: [
            "Todos os benefícios do Pro Mensal",
            "Desconto significativo em relação ao plano mensal",
            "Menos preocupações com renovações frequentes"
        ],
        highlight: "Melhor Valor!"
    }
];

export default function BillingPage() {
  const { isProUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPlanRenewsOnLocale, setCurrentPlanRenewsOnLocale] = React.useState('');
  const [billingHistoryLocale, setBillingHistoryLocale] = React.useState<typeof billingHistoryMock>([]);

  const currentPlan = isProUser ? {
    name: "Plano Pro",
    price: "Conforme Assinatura", // Poderia ser mais específico se tivéssemos os dados
    renewsOn: "Verificar Stripe", // Placeholder
    status: "Ativo",
  } : currentPlanMock;

  React.useEffect(() => {
    // Simulação de data de renovação para usuário Pro
    if (isProUser) {
        const renews = new Date();
        renews.setMonth(renews.getMonth() + 1); // Exemplo: renova no próximo mês
        setCurrentPlanRenewsOnLocale(renews.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }));
    } else {
        setCurrentPlanRenewsOnLocale(currentPlan.renewsOn);
    }
    setBillingHistoryLocale(billingHistoryMock.map(item => ({ ...item })));
  }, [isProUser, currentPlan.renewsOn]);


  const handleCheckout = async (stripePriceId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: stripePriceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const session = await response.json();
      if (session.url) {
        window.location.href = session.url; // Redireciona para o checkout do Stripe
      } else {
        throw new Error("URL de checkout não recebida.");
      }
    } catch (err: any) {
      console.error("Falha ao iniciar checkout:", err);
      setError(err.message || "Não foi possível iniciar o processo de pagamento. Tente novamente.");
      setIsLoading(false);
    }
  };


  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-headline font-semibold">Faturamento e Assinatura</h1>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro no Pagamento</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Seu Plano de Assinatura Atual</CardTitle>
          <CardDescription>Gerencie seu plano MemeTrade.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-primary">{currentPlan.name}</h3>
            <p className="text-muted-foreground">{currentPlan.price}</p>
            <p className="text-sm text-muted-foreground">Renova em: {currentPlanRenewsOnLocale}</p>
            <Badge className={`mt-2 ${currentPlan.status === "Ativo" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
              {currentPlan.status}
            </Badge>
          </div>
           <div className="flex flex-col sm:flex-row gap-2">
            {currentPlan.name === "Plano Gratuito" ? (
                 <Button disabled className="bg-primary hover:bg-primary/90 text-primary-foreground opacity-50 cursor-not-allowed">
                    <ShieldCheck className="mr-2 h-4 w-4"/> Faça Upgrade abaixo
                </Button>
            ) : (
                <>
                    <Button variant="outline" disabled>Mudar Plano (Indisponível)</Button>
                    <Button variant="destructive" disabled> <XCircle className="mr-2 h-4 w-4"/> Cancelar Assinatura (Indisponível)</Button>
                </>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {!isProUser && (
        <Card id="available-plans">
            <CardHeader>
                <CardTitle>Opções de Planos MemeTrade Pro</CardTitle>
                <CardDescription>
                    Escolha o plano que melhor se adapta às suas necessidades.
                    <br />
                    <span className="text-xs text-muted-foreground">
                        Substitua os `stripePriceId` no código pelos IDs reais do seu painel Stripe para habilitar o checkout.
                    </span>
                </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                {availablePlans.map(plan => (
                    <Card key={plan.name} className={`flex flex-col ${plan.highlight ? 'border-primary shadow-primary/20' : 'border-border'}`}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {plan.name}
                                {plan.highlight && <Badge variant="default" className="bg-primary text-primary-foreground">{plan.highlight}</Badge>}
                            </CardTitle>
                            <CardDescription className="text-2xl font-bold text-foreground">{plan.priceString}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-2">
                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                            <ul className="space-y-1 text-sm">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-center">
                                        <Star className="h-4 w-4 mr-2 text-yellow-400 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button 
                              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                              onClick={() => handleCheckout(plan.stripePriceId)}
                              disabled={isLoading || plan.stripePriceId.includes('_PLACEHOLDER')}
                            >
                              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Escolher Plano'}
                              {plan.name.split(' ')[1]}
                            </Button>
                        </CardFooter>
                         {plan.stripePriceId.includes('_PLACEHOLDER') && (
                            <p className="text-xs text-destructive text-center px-6 pb-2">Configure o Price ID no Stripe.</p>
                        )}
                    </Card>
                ))}
            </CardContent>
        </Card>
      )}
      
      <Separator />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Métodos de Pagamento</CardTitle>
            <CardDescription>
              {isProUser ? "Gerencie seus métodos de pagamento salvos." : "Adicione um método para futuras assinaturas Pro."}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" disabled><PlusCircle className="mr-2 h-4 w-4"/> Adicionar Método (Indisponível)</Button>
        </CardHeader>
        <CardContent>
          {isProUser && paymentMethodsMock.length === 0 ? ( // Simular um cartão para Pro, se não houver
             <ul className="space-y-3">
                <li className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">Visa final 4242 (Simulado)</p>
                      <p className="text-xs text-muted-foreground">Expira em 12/25</p>
                    </div>
                    <Badge variant="secondary">Padrão</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled><Edit className="h-4 w-4" /></Button>
                  </div>
                </li>
            </ul>
          ) : paymentMethodsMock.length > 0 ? (
            <ul className="space-y-3">
              {paymentMethodsMock.map(method => (
                <li key={method.id} className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">{method.type} final {method.last4}</p>
                      <p className="text-xs text-muted-foreground">Expira em {method.expiry}</p>
                    </div>
                    {method.isDefault && <Badge variant="secondary">Padrão</Badge>}
                  </div>
                  <div className="flex gap-2">
                    {!method.isDefault && <Button variant="ghost" size="sm" disabled>Definir como Padrão</Button>}
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled><Edit className="h-4 w-4" /></Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              {isProUser ? "Nenhum método de pagamento gerenciado via Stripe." : "Nenhum método de pagamento salvo. Adicione um para assinar o plano Pro."}
            </p>
          )}
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Faturamento</CardTitle>
          <CardDescription>Revise suas faturas e pagamentos anteriores (simulado).</CardDescription>
        </CardHeader>
        <CardContent>
          {billingHistoryLocale.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Fatura</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistoryLocale.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Pago" ? "default" : "secondary"} 
                             className={item.status === "Pago" ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>
                        <Download className="mr-2 h-4 w-4" /> Baixar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">
              {isProUser ? "Nenhum histórico de faturamento simulado para exibir." : "Nenhum histórico de faturamento disponível para o plano gratuito."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
