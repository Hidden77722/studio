
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, BellDot, ShieldCheck, Palette, Volume2, PlayCircle } from "lucide-react"; // Removed AlertTriangle, QrCode, Loader2, Smartphone
import React from "react";
import { useToast } from "@/hooks/use-toast";
// AlertDialog and related components might still be used by "Alterar Senha" or other features, so keep if general.
// For now, assuming it was mainly for 2FA dialog. If other dialogs exist, keep. Let's remove if not used.
// Keeping AlertDialog for potential future use or if other parts of the page might use it.
// If it's confirmed only 2FA used it, then it can be removed too.

// Removed generate2FASetup import
// import { generate2FASetup, type Generate2FASetupOutput } from "@/ai/flows/generate-2fa-setup-flow";

export default function SettingsPage() {
  const { toast } = useToast();
  const [name, setName] = React.useState("Pro Trader");
  const [email, setEmail] = React.useState("pro@memetrade.com");
  const [enableEmailNotifications, setEnableEmailNotifications] = React.useState(true);
  const [enablePushNotifications, setEnablePushNotifications] = React.useState(true);
  // Removed 2FA related states
  // const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false); 
  const [selectedTheme, setSelectedTheme] = React.useState("dark"); 
  const [notificationSound, setNotificationSound] = React.useState(
    "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" 
  );
  // Removed 2FA related states
  // const [verificationCode, setVerificationCode] = React.useState("");
  // const [isSettingUp2FA, setIsSettingUp2FA] = React.useState(false);
  // const [twoFASetupData, setTwoFASetupData] = React.useState<Generate2FASetupOutput | null>(null);
  // const [twoFAError, setTwoFAError] = React.useState<string | null>(null);

  const handleSaveProfile = () => {
    toast({ title: "Perfil Salvo!", description: "Suas informações de perfil foram atualizadas." });
  }

  const handleSaveNotificationSettings = () => {
    toast({ title: "Notificações Salvas!", description: "Suas preferências de notificação foram atualizadas." });
  }

  // Removed 2FA related functions
  // const handleInitiate2FASetup = async () => { ... };
  // const onConfirmEnableAuthenticatorApp = () => { ... };
  // const onConfirmDisableAuthenticatorApp = () => { ... };

  const handleTestSoundNotification = () => {
    toast({
      title: "🔔 Notificação de Teste",
      description: "Este é um alerta de teste com som!",
    });

    if (notificationSound && notificationSound.trim() !== "") {
      try {
        const audio = new Audio(notificationSound);
        audio.addEventListener('error', (e) => {
          let errorMessage = "Não foi possível carregar o som. ";
          const errorCode = audio.error?.code;
          if (errorCode === 1) errorMessage += "Reprodução abortada.";
          else if (errorCode === 2) errorMessage += "Erro de rede.";
          else if (errorCode === 3) errorMessage += "Erro ao decodificar.";
          else if (errorCode === 4) errorMessage += "Formato/URL não suportado ou inacessível.";
          else errorMessage += "Causa desconhecida.";
          if (audio.error?.message) errorMessage += ` Detalhes: ${audio.error.message}`;
          toast({ title: "🔇 Falha ao Carregar Áudio", description: errorMessage, variant: "destructive" });
        });
        audio.play().catch(playError => {
          toast({ title: "🔇 Erro na Reprodução", description: "Não foi possível iniciar a reprodução.", variant: "destructive" });
        });
      } catch (constructorError) { 
        toast({ title: "🔇 Erro Crítico no Áudio", description: "Exceção ao configurar o som.", variant: "destructive" });
      }
    } else {
       toast({ title: "🔇 Som não configurado", description: "Nenhuma URL de som foi configurada.", variant: "default" });
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-headline font-semibold">Configurações</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><User className="mr-2 h-5 w-5 text-primary" /> Informações do Perfil</CardTitle>
          <CardDescription>Atualize seus dados pessoais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Endereço de Email</Label>
            <Input id="email" type="email" value={email} disabled />
            <p className="text-xs text-muted-foreground">O endereço de email não pode ser alterado aqui.</p>
          </div>
          <Button onClick={handleSaveProfile}>Salvar Perfil</Button>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><BellDot className="mr-2 h-5 w-5 text-primary" /> Preferências de Notificação</CardTitle>
          <CardDescription>Gerencie como você recebe alertas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
              <span>Notificações por Email</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receba alertas de novos trades e atualizações importantes por email.
              </span>
            </Label>
            <Switch id="email-notifications" checked={enableEmailNotifications} onCheckedChange={setEnableEmailNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
              <span>Notificações Push</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receba alertas instantâneos diretamente no seu dispositivo (se o app estiver instalado).
              </span>
            </Label>
            <Switch id="push-notifications" checked={enablePushNotifications} onCheckedChange={setEnablePushNotifications} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="notification-sound" className="flex items-center"><Volume2 className="mr-2 h-4 w-4" /> Som de Notificação</Label>
            <Input id="notification-sound" value={notificationSound} onChange={e => setNotificationSound(e.target.value)} placeholder="URL de um arquivo de som direto (ex: .mp3, .wav)" />
            <p className="text-xs text-muted-foreground">Personalize o som para alertas de novos trades. Insira uma URL válida e de acesso direto para um arquivo de som.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSaveNotificationSettings}>Salvar Configurações de Notificação</Button>
            <Button variant="outline" onClick={handleTestSoundNotification}>
              <PlayCircle className="mr-2 h-4 w-4" /> Testar Notificação Sonora
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Segurança</CardTitle>
          <CardDescription>Aumente a segurança da sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Senha</Label>
            <Button variant="outline">Alterar Senha</Button>
          </div>
          {/* Removed 2FA App Authenticator Section */}
        </CardContent>
      </Card>
      
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" /> Aparência</CardTitle>
          <CardDescription>Personalize a aparência (recurso futuro).</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Opções de personalização de tema estarão disponíveis aqui em uma atualização futura.</p>
        </CardContent>
      </Card>

    </div>
  );
}
