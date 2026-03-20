import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "./Header/Header";
import { AppSidebar } from "./Sidebar/AppSidebar";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto bg-muted/40 p-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
