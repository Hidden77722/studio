
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
import { Home, BarChart3, History, Settings, HelpCircle, Newspaper, Users, Flame, Eye, BotMessageSquare, Wand2, ShieldAlert } from "lucide-react"; 
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/dashboard", label: "Início do Painel", icon: Home },
  { href: "/dashboard/live-calls", label: "Alertas ao Vivo", icon: Newspaper },
  { href: "/dashboard/hot-pairs", label: "Pares em Alta (DEX)", icon: Flame },
  { href: "/dashboard/most-viewed", label: "Moedas Mais Vistas", icon: Eye }, // Updated label and href
  { href: "/dashboard/influencers", label: "Influenciadores", icon: Users },
  { href: "/dashboard/history", label: "Histórico de Trades", icon: History },
  { href: "/dashboard/performance", label: "Desempenho", icon: BarChart3 },
  { href: "/dashboard/market-sentiment-example", label: "Análise de Sentimento IA", icon: BotMessageSquare },
  { href: "/dashboard/generate-trade-call", label: "Gerador de Call IA", icon: Wand2 },
];

const proNavItems = [
];

const bottomNavItems = [
  { href: "/dashboard/settings", label: "Configurações", icon: Settings },
  { href: "/dashboard/support", label: "Suporte", icon: HelpCircle },
];

function DashboardSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { isProUser } = useAuth(); // Get pro status from context
  const isCollapsed = state === "collapsed";

  const allNavItems = isProUser ? [...navItems, ...proNavItems] : navItems;

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4 flex items-center justify-between">
        {!isCollapsed && <AppLogo />}
        <SidebarTrigger className="ml-auto data-[state=open]:hidden data-[state=closed]:block" />
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {allNavItems.map((item) => (
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
           {!isProUser && ( // Show "Seja Pro" if user is not pro
             <SidebarMenuItem>
                <Link href="/dashboard/billing">
                    <SidebarMenuButton
                    isActive={pathname === "/dashboard/billing"}
                    tooltip="Seja Pro"
                    className="justify-start !bg-primary/10 !text-primary hover:!bg-primary/20"
                    >
                    <ShieldAlert className="h-5 w-5" />
                    {!isCollapsed && <span>Seja Pro para mais!</span>}
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
           )}
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
  const { user, loading, isProUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    // AuthProvider shows its own full-page spinner during initial load
    // or when user is null and redirecting.
    // So, we return null here to avoid double spinners.
    return null;
  }

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
              Bem-vindo(a), {user.displayName || user.email?.split('@')[0] || "Usuário"}! {isProUser && <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full ml-2">PRO</span>}
            </div>
            <UserProfileDropdown
              userName={user.displayName || user.email?.split('@')[0] || "Usuário"}
              userEmail={user.email || ""}
              avatarUrl={user.photoURL || undefined}
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
