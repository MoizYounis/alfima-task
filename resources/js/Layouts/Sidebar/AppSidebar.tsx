import { Link, usePage } from "@inertiajs/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { dashboardNavItems } from "@/Layouts/data";

export function AppSidebar() {
  const { url } = usePage();

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold">
            a
          </div>
          <div className="text-sm font-semibold leading-tight">
            alfima
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {(() => {
                    const isDashboardRoot = item.link === "/dashboard";
                    const isActive = isDashboardRoot
                      ? url === "/dashboard"
                      : url === item.link || url.startsWith(`${item.link}/`);

                    return (
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="justify-start"
                  >
                    <Link href={item.link}>{item.title}</Link>
                  </SidebarMenuButton>
                    );
                  })()}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}

