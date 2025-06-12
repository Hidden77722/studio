
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, BellDot, ShieldCheck, Palette, Volume2, PlayCircle, Smartphone, AlertTriangle, QrCode, Loader2 } from "lucide-react"; // Added Loader2
import React from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { generate2FASetup, type Generate2FASetupOutput } from "@/ai/flows/generate-2fa-setup-flow"; // Import the new flow

export default function SettingsPage() {
  const { toast } = useToast();
  const [name, setName] = React.useState("Pro Trader");
  const [email, setEmail] = React.useState("pro@memetrade.com");
  const [enableEmailNotifications, setEnableEmailNotifications] = React.useState(true);
  const [enablePushNotifications, setEnablePushNotifications] = React.useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false); 
  const [selectedTheme, setSelectedTheme] = React.useState("dark"); 
  const [notificationSound, setNotificationSound] = React.useState(
    "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" 
  );
  const [verificationCode, setVerificationCode] = React.useState("");
  const [isSettingUp2FA, setIsSettingUp2FA] = React.useState(false);
  const [twoFASetupData, setTwoFASetupData] = React.useState<Generate2FASetupOutput | null>(null);
  const [twoFAError, setTwoFAError] = React.useState<string | null>(null);

  const handleSaveProfile = () => {
    toast({ title: "Perfil Salvo!", description: "Suas informações de perfil foram atualizadas." });
  }

  const handleSaveNotificationSettings = () => {
    toast({ title: "Notificações Salvas!", description: "Suas preferências de notificação foram atualizadas." });
  }

  const handleInitiate2FASetup = async () => {
    setIsSettingUp2FA(true);
    setTwoFAError(null);
    setTwoFASetupData(null);
    try {
      const setupData = await generate2FASetup({});
      setTwoFASetupData(setupData);
    } catch (error) {
      console.error("Error initiating 2FA setup:", error);
      setTwoFAError("Falha ao iniciar a configuração do 2FA. Tente novamente.");
      toast({ title: "Erro na Configuração 2FA", description: "Não foi possível buscar os dados para configuração.", variant: "destructive" });
    } finally {
      setIsSettingUp2FA(false);
    }
  };

  const onConfirmEnableAuthenticatorApp = () => {
    // Simulação: aqui ocorreria a verificação do 'verificationCode' contra o servidor
    // usando o 'twoFASetupData.secretKey'.
    // Se bem-sucedido:
    setTwoFactorEnabled(true);
    toast({
      title: "📱 2FA com App Autenticador Habilitado (Simulado)",
      description: "A autenticação de dois fatores com aplicativo autenticador foi ativada. (Simulação)",
    });
    setVerificationCode(""); 
    setTwoFASetupData(null); // Limpar dados de setup
  };

  const onConfirmDisableAuthenticatorApp = () => {
    setTwoFactorEnabled(false);
    toast({
      title: "🚫 2FA com App Autenticador Desabilitado (Simulado)",
      description: "A autenticação de dois fatores com aplicativo autenticador foi desativada. (Simulação)",
      variant: "destructive"
    });
  };

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
          <div className="flex items-center justify-between">
            <Label htmlFor="2fa-app" className="flex flex-col space-y-1">
              <span>Autenticação com Aplicativo (2FA)</span>
               <span className="font-normal leading-snug text-muted-foreground">
                Use um aplicativo como Google Authenticator ou Authy.
              </span>
            </Label>
            {twoFactorEnabled ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Desabilitar 2FA com App</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-destructive"/>Desabilitar 2FA com App Autenticador?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Isso removerá a camada adicional de segurança do aplicativo autenticador. Você tem certeza?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirmDisableAuthenticatorApp} className="bg-destructive hover:bg-destructive/90">Confirmar Desativação</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <AlertDialog onOpenChange={(open) => {
                if (open) handleInitiate2FASetup(); // Fetch setup data when dialog opens
                else { setTwoFASetupData(null); setTwoFAError(null); setVerificationCode(""); } // Reset on close
              }}>
                <AlertDialogTrigger asChild>
                  <Button variant="default">Habilitar 2FA com App</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center"><Smartphone className="mr-2 h-5 w-5 text-primary"/>Configurar 2FA com Aplicativo Autenticador</AlertDialogTitle>
                  </AlertDialogHeader>
                  
                  {isSettingUp2FA && (
                    <div className="flex flex-col items-center justify-center space-y-2 py-8">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      <p className="text-muted-foreground">Gerando dados de configuração...</p>
                    </div>
                  )}

                  {twoFAError && !isSettingUp2FA && (
                    <div className="text-destructive-foreground bg-destructive/80 p-3 rounded-md text-sm">
                      <AlertTriangle className="inline-block mr-2 h-4 w-4" /> {twoFAError}
                    </div>
                  )}

                  {twoFASetupData && !isSettingUp2FA && (
                    <>
                      <AlertDialogDescription className="space-y-3 text-left">
                        <p>Para habilitar, siga estes passos:</p>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Abra seu aplicativo autenticador (ex: Google Authenticator, Authy).</li>
                          <li>Escaneie o QR Code abaixo ou insira a chave secreta manualmente.</li>
                        </ol>
                         <div className="my-4 p-4 bg-muted rounded-md flex flex-col items-center justify-center">
                          <QrCode className="h-24 w-24 text-muted-foreground my-2" data-ai-hint="qr code placeholder"/>
                          <p className="text-xs text-muted-foreground text-center">Placeholder para QR Code Real</p>
                          <p className="text-xs text-muted-foreground text-center mt-2">Use uma biblioteca como 'qrcode.react' para renderizar o URI abaixo como um QR Code:</p>
                          <Input type="text" readOnly value={twoFASetupData.otpAuthUri} className="mt-1 text-xs text-center" onClick={(e) => (e.target as HTMLInputElement).select()} />

                          <p className="text-xs text-muted-foreground text-center mt-3">Ou insira esta chave secreta manualmente:</p>
                          <Input type="text" readOnly value={twoFASetupData.secretKey} className="mt-1 text-xs text-center font-mono" onClick={(e) => (e.target as HTMLInputElement).select()} />
                        </div>
                        <p>Após adicionar ao seu app, insira o código de 6 dígitos gerado para verificar:</p>
                      </AlertDialogDescription>
                      <div className="space-y-2 py-2">
                         <Label htmlFor="verification-code">Código de Verificação (6 dígitos)</Label>
                         <Input 
                            id="verification-code" 
                            placeholder="123456" 
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength={6}
                          />
                      </div>
                    </>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    <strong>Nota Importante:</strong> Esta é uma simulação. Em uma implementação real, a chave secreta seria única por usuário, armazenada de forma segura no backend, e o QR Code gerado dinamicamente. A verificação do código também ocorreria no backend.
                  </p>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => {setTwoFASetupData(null); setTwoFAError(null); setVerificationCode("");} }>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={onConfirmEnableAuthenticatorApp} 
                      disabled={isSettingUp2FA || !twoFASetupData || verificationCode.length !== 6}
                    >
                      Verificar e Habilitar (Simulado)
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
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
