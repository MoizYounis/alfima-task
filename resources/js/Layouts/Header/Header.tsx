import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  return (
    <header className="border-b border-border bg-background/90 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3">
        <SidebarTrigger />
        <div className="text-sm text-muted-foreground">
          Dashboard
        </div>
      </div>
    </header>
  );
}

