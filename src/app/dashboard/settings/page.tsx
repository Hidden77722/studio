"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, BellDot, ShieldCheck, Palette, Volume2 } from "lucide-react";

export default function SettingsPage() {
  // Mock states, in a real app these would come from user data / context
  const [name, setName] = React.useState("Pro Trader");
  const [email, setEmail] = React.useState("pro@memetrade.com");
  const [enableEmailNotifications, setEnableEmailNotifications] = React.useState(true);
  const [enablePushNotifications, setEnablePushNotifications] = React.useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState("dark"); // 'dark', 'light', 'system'
  const [notificationSound, setNotificationSound] = React.useState("default_sound.mp3");


  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-headline font-semibold">Settings</h1>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><User className="mr-2 h-5 w-5 text-primary" /> Profile Information</CardTitle>
          <CardDescription>Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={email} disabled />
            <p className="text-xs text-muted-foreground">Email address cannot be changed here.</p>
          </div>
          <Button>Save Profile</Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><BellDot className="mr-2 h-5 w-5 text-primary" /> Notification Preferences</CardTitle>
          <CardDescription>Manage how you receive alerts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
              <span>Email Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive new call alerts and important updates via email.
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
              <span>Push Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Get instant alerts directly on your device (if app installed).
              </span>
            </Label>
            <Switch
              id="push-notifications"
              checked={enablePushNotifications}
              onCheckedChange={setEnablePushNotifications}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="notification-sound" className="flex items-center"><Volume2 className="mr-2 h-4 w-4" /> Notification Sound</Label>
            {/* In a real app, this would be a select dropdown with sound options */}
            <Input id="notification-sound" value={notificationSound} onChange={e => setNotificationSound(e.target.value)} placeholder="default_sound.mp3" />
            <p className="text-xs text-muted-foreground">Customize the sound for new call alerts.</p>
          </div>
          <Button>Save Notification Settings</Button>
        </CardContent>
      </Card>
      
      <Separator />

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Security</CardTitle>
          <CardDescription>Enhance your account security.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Password</Label>
            <Button variant="outline">Change Password</Button>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="2fa" className="flex flex-col space-y-1">
              <span>Two-Factor Authentication (2FA)</span>
               <span className="font-normal leading-snug text-muted-foreground">
                Add an extra layer of security to your account.
              </span>
            </Label>
            <Button variant={twoFactorEnabled ? "destructive" : "default"} onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}>
                {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Separator />

      {/* Appearance Settings - Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" /> Appearance</CardTitle>
          <CardDescription>Customize the look and feel (future feature).</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Theme customization options will be available here in a future update.</p>
        </CardContent>
      </Card>

    </div>
  );
}
