
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Edit3, Mail, UserCircle, Shield, CalendarDays, AlertTriangle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading, isProUser } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  
  // States for formatted dates
  const [joinDateLocale, setJoinDateLocale] = useState('');
  const [lastLoginLocale, setLastLoginLocale] = useState('');
  const [renewsOnLocale, setRenewsOnLocale] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || user.email?.split('@')[0] || "Usuário");
      if (user.metadata.creationTime) {
        setJoinDateLocale(new Date(user.metadata.creationTime).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }));
      }
      if (user.metadata.lastSignInTime) {
        setLastLoginLocale(new Date(user.metadata.lastSignInTime).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }));
      }
      // Mock renewal date for Pro users for now
      if (isProUser) {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        setRenewsOnLocale(nextYear.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }));
      } else {
        setRenewsOnLocale("N/A");
      }
    }
  }, [user, isProUser]);

  const getInitials = (nameStr: string | null | undefined) => {
    if (!nameStr) return "U";
    const names = nameStr.split(' ');
    if (names.length > 1 && names[0] && names[names.length -1]) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  const handleSave = async () => {
    if (!user) return;
    if (displayName.trim() === "") {
        toast({ title: "Erro", description: "O nome não pode estar vazio.", variant: "destructive" });
        return;
    }
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      toast({ title: "Sucesso!", description: "Seu nome foi atualizado." });
      setIsEditing(false);
      // Note: AuthContext will eventually pick up the change, or you might need to manually update the context if immediate reflection is critical elsewhere.
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({ title: "Erro ao Atualizar", description: error.message || "Não foi possível salvar o nome.", variant: "destructive" });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setDisplayName(user.displayName || user.email?.split('@')[0] || "Usuário");
    }
  };
  
  if (loading) {
    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-headline font-semibold">Meu Perfil</h1>
            <Card className="shadow-xl">
                <CardHeader className="items-center text-center">
                    <Skeleton className="h-32 w-32 rounded-full mb-4" />
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Separator className="my-6" />
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Skeleton className="h-10 w-24" />
                </CardFooter>
            </Card>
        </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-headline font-semibold">Meu Perfil</h1>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <AlertTriangle className="mr-2 h-6 w-6 text-destructive" />
              Usuário não encontrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Não foi possível carregar os dados do perfil. Por favor, tente fazer login novamente.</p>
            <Button asChild className="mt-4">
              <Link href="/auth/login">Ir para Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-headline font-semibold">Meu Perfil</h1>

      <Card className="shadow-xl">
        <CardHeader className="items-center text-center">
          <div className="relative mb-4">
            <Avatar className="h-32 w-32 border-4 border-primary">
              <AvatarImage src={user.photoURL || undefined} alt={displayName} data-ai-hint="user avatar" />
              <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full bg-card hover:bg-muted" onClick={() => toast({title: "Em Breve!", description: "Funcionalidade de editar avatar será implementada."})}>
              <Edit3 className="h-4 w-4" />
              <span className="sr-only">Editar Avatar</span>
            </Button>
          </div>
          {isEditing ? (
            <Input 
              className="text-2xl font-headline text-center max-w-xs mx-auto"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Seu nome"
            />
          ) : (
            <CardTitle className="text-2xl font-headline">{displayName}</CardTitle>
          )}
          <CardDescription className="text-muted-foreground">{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoRow icon={<UserCircle className="h-5 w-5 text-primary"/>} label="Nome de Usuário" value={displayName} isEditing={isEditing} onChange={setDisplayName} />
          <InfoRow icon={<Mail className="h-5 w-5 text-primary"/>} label="Email" value={user.email || "N/A"} editable={false} />
          <InfoRow icon={<CalendarDays className="h-5 w-5 text-primary"/>} label="Entrou em" value={joinDateLocale || "N/A"} editable={false} />
          <InfoRow icon={<CalendarDays className="h-5 w-5 text-primary"/>} label="Último Login" value={lastLoginLocale || "N/A"} editable={false} />
          
          <Separator className="my-6" />

          <h3 className="text-lg font-semibold font-headline flex items-center"><Shield className="mr-2 h-5 w-5 text-primary"/> Assinatura</h3>
          <InfoRow label="Plano Atual" value={isProUser ? "MemeTrade Pro" : "Plano Gratuito"} editable={false} />
          <InfoRow label="Status" value={isProUser && user.email === "pro@memetrade.com" ? `Ativo até ${renewsOnLocale}` : "N/A"} editable={false} />
           <Button variant="link" asChild className="p-0 h-auto text-primary hover:underline">
            <Link href="/dashboard/billing">Gerenciar Assinatura</Link>
           </Button>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancelEdit}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar Alterações</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

interface InfoRowProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
  isEditing?: boolean;
  onChange?: (value: string) => void;
  editable?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, isEditing, onChange, editable = true }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-b-0">
      <div className="flex items-center">
        {icon && <span className="mr-3 text-muted-foreground">{icon}</span>}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      {isEditing && editable && onChange ? (
        <Input className="max-w-[250px] text-sm text-right h-8" value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <span className="text-sm text-foreground text-right">{value}</span>
      )}
    </div>
  );
};

// Simple Skeleton component for loading state
const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("animate-pulse rounded-md bg-muted/50", className)} {...props} />
);
