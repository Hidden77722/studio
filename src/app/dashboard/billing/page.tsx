
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, PlusCircle, Edit, Star } from "lucide-react";
import React from "react";

// Mock data
const currentPlan = {
  name: "Annual Pro",
  price: "$299,00/ano", // Preço atualizado
  renewsOn: "15 de Janeiro de 2025",
  status: "Ativo",
};

const paymentMethods = [
  { id: "pm1", type: "Visa", last4: "4242", expiry: "12/25", isDefault: true },
  { id: "pm2", type: "Mastercard", last4: "5555", expiry: "08/26", isDefault: false },
];

const billingHistory = [
  { id: "bh1", date: "15 de Janeiro de 2024", description: "Assinatura Anual Pro", amount: "$299.00", status: "Pago" }, // Preço atualizado no histórico mock
  { id: "bh2", date: "10 de Dezembro de 2023", description: "Pro Mensal (Rateado)", amount: "$29.99", status: "Pago" }, // Preço atualizado no histórico mock
];

const availablePlans = [
    {
        name: "Pro Mensal",
        price: "$29,99/mês",
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
        price: "$299,00/ano",
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
  const [currentPlanRenewsOnLocale, setCurrentPlanRenewsOnLocale] = React.useState('');
  const [billingHistoryLocale, setBillingHistoryLocale] = React.useState<typeof billingHistory>([]);

  React.useEffect(() => {
    setCurrentPlanRenewsOnLocale(currentPlan.renewsOn);
    setBillingHistoryLocale(billingHistory.map(item => ({ ...item })));
  }, []);


  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-headline font-semibold">Faturamento e Assinatura</h1>

      {/* Current Plan - Assumes the user is on 'Annual Pro' for this mock */}
      <Card>
        <CardHeader>
          <CardTitle>Seu Plano de Assinatura Atual</CardTitle>
          <CardDescription>Gerencie seu plano MemeTrade Pro.</CardDescription>
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
            <Button variant="outline">Mudar Plano</Button>
            <Button variant="destructive">Cancelar Assinatura</Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Available Plans Section */}
      <Card>
        <CardHeader>
            <CardTitle>Opções de Planos MemeTrade Pro</CardTitle>
            <CardDescription>Escolha o plano que melhor se adapta às suas necessidades.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
            {availablePlans.map(plan => (
                <Card key={plan.name} className={`flex flex-col ${plan.highlight ? 'border-primary shadow-primary/20' : 'border-border'}`}>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            {plan.name}
                            {plan.highlight && <Badge variant="default" className="bg-primary text-primary-foreground">{plan.highlight}</Badge>}
                        </CardTitle>
                        <CardDescription className="text-2xl font-bold text-foreground">{plan.price}</CardDescription>
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
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                            {plan.name === currentPlan.name ? "Seu Plano Atual" : "Escolher Plano"}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </CardContent>
      </Card>
      
      <Separator />

      {/* Payment Methods */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Métodos de Pagamento</CardTitle>
            <CardDescription>Suas opções de pagamento salvas.</CardDescription>
          </div>
          <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4"/> Adicionar Método de Pagamento</Button>
        </CardHeader>
        <CardContent>
          {paymentMethods.length > 0 ? (
            <ul className="space-y-3">
              {paymentMethods.map(method => (
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
                    {!method.isDefault && <Button variant="ghost" size="sm">Definir como Padrão</Button>}
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Nenhum método de pagamento salvo.</p>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Faturamento</CardTitle>
          <CardDescription>Revise suas faturas e pagamentos anteriores.</CardDescription>
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
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" /> Baixar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">Nenhum histórico de faturamento disponível.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    