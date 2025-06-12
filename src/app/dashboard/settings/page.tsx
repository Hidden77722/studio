
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, BellDot, ShieldCheck, Palette, Volume2, PlayCircle, Smartphone, AlertTriangle } from "lucide-react";
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

export default function SettingsPage() {
  const { toast } = useToast();
  // Mock states, in a real app these would come from user data / context
  const [name, setName] = React.useState("Pro Trader");
  const [email, setEmail] = React.useState("pro@memetrade.com");
  const [enableEmailNotifications, setEnableEmailNotifications] = React.useState(true);
  const [enablePushNotifications, setEnablePushNotifications] = React.useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState("dark"); // 'dark', 'light', 'system'
  const [notificationSound, setNotificationSound] = React.useState(
    "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" 
  );

  const handleSaveProfile = () => {
    // In a real app, call API to save
    toast({ title: "Perfil Salvo!", description: "Suas informações de perfil foram atualizadas." });
  }

  const handleSaveNotificationSettings = () => {
     // In a real app, call API to save
    toast({ title: "Notificações Salvas!", description: "Suas preferências de notificação foram atualizadas." });
  }

  const handleToggle2FA = () => {
    // This function is now implicitly handled by the AlertDialog actions
    // The logic to call Firebase for actual 2FA enrollment/unenrollment would go in the
    // onConfirmEnable2FA and onConfirmDisable2FA functions.
  };

  const onConfirmEnable2FA = () => {
    setTwoFactorEnabled(true);
    toast({
      title: "🔑 2FA Habilitado (Simulado)",
      description: "A autenticação de dois fatores foi ativada para sua conta. (Simulação)",
    });
    // Next step would be to guide user through phone verification
  };

  const onConfirmDisable2FA = () => {
    setTwoFactorEnabled(false);
    toast({
      title: "🚫 2FA Desabilitado (Simulado)",
      description: "A autenticação de dois fatores foi desativada. (Simulação)",
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
          console.error(
            "Falha ao carregar áudio. URL:", notificationSound, 
            "MediaError Code:", audio.error?.code, 
            "MediaError Message:", audio.error?.message, 
            "Event Object:", e
          );
          
          let errorMessage = "Não foi possível carregar o som. ";
          const errorCode = audio.error?.code;
          if (errorCode === 1) {
            errorMessage += "Reprodução abortada pelo usuário ou sistema.";
          } else if (errorCode === 2) {
            errorMessage += "Erro de rede ao tentar carregar o áudio.";
          } else if (errorCode === 3) {
            errorMessage += "Erro ao decodificar o arquivo de áudio (formato inválido ou corrompido?).";
          } else if (errorCode === 4) {
            errorMessage += "Formato/URL do áudio não suportado ou inacessível. Verifique o link direto, CORS, e se o formato (ex: MP3, WAV) é válido e compatível com seu navegador. Pode ser um erro de formato específico.";
          } else {
            errorMessage += "Causa desconhecida. Verifique a URL, sua conexão e o console do navegador para mais detalhes.";
          }
          
          if (audio.error?.message && audio.error.message.length > 1) {
            errorMessage += ` Detalhes: ${audio.error.message}`;
          }

          toast({
            title: "🔇 Falha ao Carregar Áudio",
            description: errorMessage,
            variant: "destructive",
          });
        });

        audio.play()
          .then(() => {
            console.log(`Tentando reproduzir som: ${notificationSound}`);
          })
          .catch(playError => {
            console.error("Erro ao tentar reproduzir o som (play promise rejected):", playError);
            toast({
              title: "🔇 Erro na Reprodução",
              description: "Não foi possível iniciar a reprodução. O navegador pode ter bloqueado a reprodução automática ou ocorrido outro erro. Verifique o console do navegador para mais detalhes.",
              variant: "destructive",
            });
          });

      } catch (constructorError) { 
        console.error("Exceção ao criar o objeto de áudio:", constructorError);
        toast({
          title: "🔇 Erro Crítico no Áudio",
          description: "Ocorreu uma exceção ao tentar configurar o som. Verifique se a URL é válida e acessível.",
          variant: "destructive",
        });
      }
    } else {
       toast({
          title: "🔇 Som não configurado",
          description: "Nenhum som de notificação foi configurado. Insira uma URL válida para um arquivo de som no campo abaixo.",
          variant: "default",
        });
    }
  };


  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-headline font-semibold">Configurações</h1>

      {/* Profile Settings */}
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

      {/* Notification Settings */}
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
            <Switch
              id="email-notifications"
              checked={enableEmailNotifications}
              onCheckedChange={setEnableEmailNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
              <span>Notificações Push</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receba alertas instantâneos diretamente no seu dispositivo (se o app estiver instalado).
              </span>
            </Label>
            <Switch
              id="push-notifications"
              checked={enablePushNotifications}
              onCheckedChange={setEnablePushNotifications}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="notification-sound" className="flex items-center"><Volume2 className="mr-2 h-4 w-4" /> Som de Notificação</Label>
            <Input 
              id="notification-sound" 
              value={notificationSound} 
              onChange={e => setNotificationSound(e.target.value)} 
              placeholder="URL de um arquivo de som direto (ex: .mp3, .wav)" 
            />
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

      {/* Security Settings */}
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
            <Label htmlFor="2fa" className="flex flex-col space-y-1">
              <span>Autenticação de Dois Fatores (2FA)</span>
               <span className="font-normal leading-snug text-muted-foreground">
                Adicione uma camada extra de segurança à sua conta.
              </span>
            </Label>
            {twoFactorEnabled ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Desabilitar 2FA</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-destructive"/>Desabilitar Autenticação de Dois Fatores?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Isso removerá a camada adicional de segurança da sua conta. Você tem certeza?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirmDisable2FA} className="bg-destructive hover:bg-destructive/90">Confirmar Desativação</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="default">Habilitar 2FA</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center"><Smartphone className="mr-2 h-5 w-5 text-primary"/>Configurar Autenticação de Dois Fatores (2FA)</AlertDialogTitle>
                    <AlertDialogDescription>
                      Para habilitar a 2FA, você normalmente precisaria verificar seu número de telefone via SMS ou configurar um aplicativo autenticador.
                      <br/><br/>
                      <strong>Este é um passo simulado.</strong> Em uma implementação real, clicar em "Prosseguir" iniciaria esse processo.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirmEnable2FA}>Prosseguir com Configuração (Simulado)</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Separator />

      {/* Appearance Settings - Placeholder */}
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
