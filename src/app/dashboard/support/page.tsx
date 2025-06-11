"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Mail, MessageSquare, Search } from "lucide-react";
import Link from "next/link";

const faqItems = [
  {
    question: "Como os alertas de trade são gerados?",
    answer: "Nossos alertas de trade são gerados usando uma combinação de análise técnica avançada, rastreamento de sentimento de mercado em tempo real e algoritmos proprietários projetados especificamente para meme coins. Nossos analistas experientes também revisam e validam os alertas antes de serem enviados."
  },
  {
    question: "Qual é a precisão típica dos alertas?",
    answer: "Embora o desempenho passado não seja indicativo de resultados futuros, nós nos esforçamos para uma alta taxa de precisão. Você pode visualizar nosso desempenho histórico e estatísticas detalhadas no Painel de Desempenho. Somos transparentes sobre nossos ganhos e perdas."
  },
  {
    question: "Como gerencio minha assinatura?",
    answer: "Você pode gerenciar sua assinatura, incluindo upgrade, downgrade ou cancelamento, na seção 'Faturamento' nas configurações da sua conta."
  },
  {
    question: "Quais exchanges são suportadas ou recomendadas?",
    answer: "Nossos alertas são geralmente para moedas disponíveis nas principais exchanges descentralizadas (DEXs) como Uniswap ou PancakeSwap, e às vezes em exchanges centralizadas (CEXs) maiores. Recomendamos o uso de exchanges respeitáveis com boa liquidez."
  },
  {
    question: "Com que rapidez preciso agir em um alerta?",
    answer: "Os mercados de meme coins são altamente voláteis. Geralmente, recomenda-se agir nos alertas o mais rápido possível após receber a notificação. No entanto, sempre avalie sua própria tolerância ao risco e não se apresse em negociações cegamente."
  }
];

export default function SupportPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-headline font-semibold">Ajuda e Suporte</h1>

      {/* Search FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Search className="mr-2 h-5 w-5 text-primary" /> Buscar na Base de Conhecimento</CardTitle>
          <CardDescription>Encontre respostas para perguntas comuns.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input type="search" placeholder="Digite sua pergunta aqui..." className="w-full" />
        </CardContent>
      </Card>

      {/* FAQ Accordion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary" /> Perguntas Frequentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left hover:no-underline">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Us */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Mail className="mr-2 h-5 w-5 text-primary" /> Contatar Suporte</CardTitle>
          <CardDescription>Não consegue encontrar o que procura? Entre em contato com nossa equipe de suporte.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Link href="mailto:support@memetrade.pro" className="w-full">
                <Button variant="outline" className="w-full">
                    <Mail className="mr-2 h-4 w-4" /> Envie-nos um Email
                </Button>
             </Link>
             <Link href="/dashboard/live-chat" className="w-full"> {/* Placeholder for live chat */}
                <Button variant="outline" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" /> Chat ao Vivo (Em Breve)
                </Button>
             </Link>
          </div>
          <form className="space-y-4">
            <div>
              <Label htmlFor="subject">Assunto</Label>
              <Input id="subject" placeholder="ex: Problema com um alerta de trade" />
            </div>
            <div>
              <Label htmlFor="message">Sua Mensagem</Label>
              <Textarea id="message" placeholder="Descreva seu problema em detalhes..." rows={5} />
            </div>
            <Button type="submit">Enviar Mensagem</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
