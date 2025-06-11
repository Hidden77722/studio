"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCard, LogOut, Settings, User, Bell } from "lucide-react";
import Link from "next/link";

interface UserProfileDropdownProps {
  userName: string;
  userEmail: string;
  avatarUrl?: string;
}

export function UserProfileDropdown({ userName, userEmail, avatarUrl }: UserProfileDropdownProps) {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" aria-label="Notificações">
        <Bell className="h-5 w-5 text-foreground" />
        <span className="sr-only">Notificações</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} alt={userName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userEmail}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/billing">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Faturamento</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
             <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            {/* In a real app, this would trigger a sign-out function */}
            <Link href="/auth/login">Sair</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
