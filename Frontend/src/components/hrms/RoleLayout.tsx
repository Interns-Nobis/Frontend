import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, type NavItem } from "./AppSidebar";
import { UserCircle2 } from "lucide-react";
import { NotificationCenter } from "./NotificationCenter";
import { ThemeToggle } from "./ThemeToggle";
import { PageTransition } from "./PageTransition";
import type { ReactNode } from "react";

export function RoleLayout({ items, role, user, children }: { items: NavItem[]; role: string; user: string; children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar items={items} role={role} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card/80 backdrop-blur px-4 sticky top-0 z-10">
            <div className="flex items-center gap-2 min-w-0">
              <SidebarTrigger />
              <div className="hidden sm:block min-w-0">
                <div className="font-semibold text-foreground leading-tight truncate">{role} Portal</div>
                <div className="text-[11px] text-muted-foreground leading-tight">HRMS</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <ThemeToggle />
              <div className="flex items-center gap-2 text-sm pl-2 ml-1 border-l">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                  {user.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                </div>
                <div className="hidden sm:flex flex-col leading-tight">
                  <span className="font-medium">{user}</span>
                  <span className="text-[11px] text-muted-foreground">{role}</span>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

// keep deprecated icon import in case other files referenced it
export { UserCircle2 };
