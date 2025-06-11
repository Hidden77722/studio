"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Edit3, Mail, UserCircle, Shield, CalendarDays } from "lucide-react";
import React from "react";

// Mock user data - in a real app, this would come from a context or API
const userProfile = {
  name: "Pro Trader",
  email: "pro@memetrade.com",
  avatarUrl: "https://placehold.co/150x150.png",
  joinDate: "2023-01-15",
  lastLogin: new Date().toISOString(),
  subscriptionTier: "Annual Pro",
  subscriptionRenews: "2025-01-15",
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(userProfile.name);

  const getInitials = (nameStr: string) => {
    const names = nameStr.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  const handleSave = () => {
    // API call to save profile
    console.log("Saving profile with name:", name);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-headline font-semibold">My Profile</h1>

      <Card className="shadow-xl">
        <CardHeader className="items-center text-center">
          <div className="relative mb-4">
            <Avatar className="h-32 w-32 border-4 border-primary">
              <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                {getInitials(userProfile.name)}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full bg-card hover:bg-muted" onClick={() => alert("Edit avatar functionality TBD")}>
              <Edit3 className="h-4 w-4" />
              <span className="sr-only">Edit Avatar</span>
            </Button>
          </div>
          {isEditing ? (
            <Input 
              className="text-2xl font-headline text-center max-w-xs mx-auto"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <CardTitle className="text-2xl font-headline">{name}</CardTitle>
          )}
          <CardDescription className="text-muted-foreground">{userProfile.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoRow icon={<UserCircle className="h-5 w-5 text-primary"/>} label="Username" value={name} isEditing={isEditing} onChange={setName} />
          <InfoRow icon={<Mail className="h-5 w-5 text-primary"/>} label="Email" value={userProfile.email} editable={false} />
          <InfoRow icon={<CalendarDays className="h-5 w-5 text-primary"/>} label="Joined" value={new Date(userProfile.joinDate).toLocaleDateString()} editable={false} />
          <InfoRow icon={<CalendarDays className="h-5 w-5 text-primary"/>} label="Last Login" value={new Date(userProfile.lastLogin).toLocaleString()} editable={false} />
          
          <Separator className="my-6" />

          <h3 className="text-lg font-semibold font-headline flex items-center"><Shield className="mr-2 h-5 w-5 text-primary"/> Subscription</h3>
          <InfoRow label="Current Tier" value={userProfile.subscriptionTier} editable={false} />
          <InfoRow label="Renews On" value={new Date(userProfile.subscriptionRenews).toLocaleDateString()} editable={false} />
           <Button variant="link" className="p-0 h-auto text-primary">Manage Subscription</Button>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => { setIsEditing(false); setName(userProfile.name); }}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
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
    <div className="flex items-center justify-between py-2 border-b border-border/50">
      <div className="flex items-center">
        {icon && <span className="mr-3">{icon}</span>}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      {isEditing && editable && onChange ? (
        <Input className="max-w-[200px] text-sm text-right" value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <span className="text-sm text-foreground">{value}</span>
      )}
    </div>
  );
};
