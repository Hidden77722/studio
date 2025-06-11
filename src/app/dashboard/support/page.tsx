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
    question: "How are trade calls generated?",
    answer: "Our trade calls are generated using a combination of advanced technical analysis, real-time market sentiment tracking, and proprietary algorithms specifically designed for meme coins. Our experienced analysts also review and validate calls before they are sent out."
  },
  {
    question: "What is the typical accuracy of the calls?",
    answer: "While past performance is not indicative of future results, we strive for a high accuracy rate. You can view our historical performance and detailed statistics on the Performance Dashboard. We are transparent about our wins and losses."
  },
  {
    question: "How do I manage my subscription?",
    answer: "You can manage your subscription, including upgrading, downgrading, or canceling, from the 'Billing' section in your account settings."
  },
  {
    question: "What exchanges are supported or recommended?",
    answer: "Our calls are generally for coins available on major decentralized exchanges (DEXs) like Uniswap or PancakeSwap, and sometimes on larger centralized exchanges (CEXs). We recommend using reputable exchanges with good liquidity."
  },
  {
    question: "How quickly do I need to act on a call?",
    answer: "Meme coin markets are highly volatile. It's generally recommended to act on calls as quickly as possible after receiving the notification. However, always assess your own risk tolerance and do not rush into trades blindly."
  }
];

export default function SupportPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-headline font-semibold">Help & Support</h1>

      {/* Search FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Search className="mr-2 h-5 w-5 text-primary" /> Search Knowledge Base</CardTitle>
          <CardDescription>Find answers to common questions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input type="search" placeholder="Type your question here..." className="w-full" />
        </CardContent>
      </Card>

      {/* FAQ Accordion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary" /> Frequently Asked Questions</CardTitle>
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
          <CardTitle className="flex items-center"><Mail className="mr-2 h-5 w-5 text-primary" /> Contact Support</CardTitle>
          <CardDescription>Can't find what you're looking for? Reach out to our support team.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Link href="mailto:support@memetrade.pro" className="w-full">
                <Button variant="outline" className="w-full">
                    <Mail className="mr-2 h-4 w-4" /> Email Us
                </Button>
             </Link>
             <Link href="/dashboard/live-chat" className="w-full"> {/* Placeholder for live chat */}
                <Button variant="outline" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" /> Live Chat (Coming Soon)
                </Button>
             </Link>
          </div>
          <form className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="e.g., Issue with a trade call" />
            </div>
            <div>
              <Label htmlFor="message">Your Message</Label>
              <Textarea id="message" placeholder="Describe your issue in detail..." rows={5} />
            </div>
            <Button type="submit">Send Message</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
