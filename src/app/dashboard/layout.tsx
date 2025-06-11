"use client";

import { AppLogo } from "@/components/shared/AppLogo";
import { UserProfileDropdown } from "@/components/shared/UserProfileDropdown";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, BarChart3, History, Settings, Info, HelpCircle, Newspaper, Rss } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navItems = [
  { href: "/dashboard", label: "Início do Painel", icon: Home },
  { href: "/dashboard/live-calls", label: "Alertas ao Vivo", icon: Newspaper },
  { href: "/dashboard/twitter-feed", label: "Feed de MemeCoins", icon: Rss },
  { href: "/dashboard/history", label: "Histórico de Trades", icon: History },
  { href: "/dashboard/performance", label: "Desempenho", icon: BarChart3 },
  { href: "/dashboard/why-this-coin-examples", label: "Insights de IA", icon: Info },
];

const bottomNavItems = [
  { href: "/dashboard/settings", label: "Configurações", icon: Settings },
  { href: "/dashboard/support", label: "Suporte", icon: HelpCircle },
];

function DashboardSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4 flex items-center justify-between">
        {!isCollapsed && <AppLogo />}
        <SidebarTrigger className="ml-auto data-[state=open]:hidden data-[state=closed]:block" />
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
         <SidebarMenu>
          {bottomNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                   className="justify-start"
                >
                  <item.icon className="h-5 w-5" />
                   {!isCollapsed && <span>{item.label}</span>}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = {
    name: "Pro Trader",
    email: "pro@memetrade.com",
    avatarUrl: "https://placehold.co/100x100.png", 
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-6">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <div className="hidden md:block font-headline text-xl">
              Bem-vindo(a), {user.name}!
            </div>
            <UserProfileDropdown
              userName={user.name}
              userEmail={user.email}
              avatarUrl={user.avatarUrl}
            />
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
