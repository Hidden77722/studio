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
import { Home, BarChart3, History, Settings, Info, HelpCircle, Newspaper } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard Home", icon: Home },
  { href: "/dashboard/live-calls", label: "Live Calls", icon: Newspaper },
  { href: "/dashboard/history", label: "Trade History", icon: History },
  { href: "/dashboard/performance", label: "Performance", icon: BarChart3 },
  { href: "/dashboard/why-this-coin-examples", label: "AI Insights", icon: Info },
];

const bottomNavItems = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/support", label: "Support", icon: HelpCircle },
];

function DashboardSidebar() {
  const pathname = usePathname();
  const { state, open } = useSidebar();
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
              <Link href={item.href} legacyBehavior passHref>
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
              <Link href={item.href} legacyBehavior passHref>
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
  // Mock user data
  const user = {
    name: "Pro Trader",
    email: "pro@memetrade.com",
    avatarUrl: "https://placehold.co/100x100.png", // Placeholder avatar
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-6">
            {/* Hamburger for mobile, only show if sidebar is not visible or collapsed state handling not via trigger */}
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <div className="hidden md:block font-headline text-xl">
              Welcome, {user.name}!
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
