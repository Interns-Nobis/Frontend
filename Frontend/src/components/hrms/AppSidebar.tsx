import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";
import { LogOut } from "lucide-react";
import nobisLogo from "@/assets/Nobis.png";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  permission?: string;
}

export function AppSidebar({ items, role }: { items: NavItem[]; role: string }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
const permissions: Record<string, boolean> = {
  dashboard: true,
  profile: true,
  attendance: true,
  leave: false,
  reports: true,
  notifications: true,
  candidateManagement: true,
  employeeManagement: true,
  organizationStructure: true,
  settings: true,
};
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 p-2">
         <div className="flex items-center gap-2">
  <Link to="/employee/dashboard">
  <img
    src={nobisLogo}
    alt="NOBIS"
    className="h-10 w-auto shrink-0 cursor-pointer"
  />
</Link>

  <div className="flex flex-col group-data-[collapsible=icon]:hidden">
    <span className="font-semibold text-sidebar-foreground text-sm">
      NOBIS Technologies
    </span>
    <span className="text-xs text-sidebar-foreground/70">
      {role}
    </span>
  </div>
</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
  .filter(
    (item) =>
      !item.permission ||
      permissions[item.permission as keyof typeof permissions]
  )
  .map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={path === item.url} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <Link to="/" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
