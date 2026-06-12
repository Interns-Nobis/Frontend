import {
  LayoutDashboard, User, FileText, Activity,
  CalendarCheck, CalendarDays,
  Users, UserCheck, BarChart3, Settings, ClipboardList, Bell,
} from "lucide-react";
import type { NavItem } from "./AppSidebar";

export const candidateNav: NavItem[] = [
  { title: "Dashboard", url: "/candidate/dashboard", icon: LayoutDashboard },
  { title: "Onboarding", url: "/candidate/onboarding", icon: ClipboardList },
  { title: "Profile", url: "/candidate/profile", icon: User },
  { title: "Documents", url: "/candidate/documents", icon: FileText },
  { title: "Application Status", url: "/candidate/status", icon: Activity },
];

export const employeeNav: NavItem[] = [
  { title: "Dashboard", url: "/employee/dashboard", icon: LayoutDashboard },
  { title: "Profile", url: "/employee/profile", icon: User },
  { title: "Attendance", url: "/employee/attendance", icon: CalendarCheck },
  { title: "Leave Management", url: "/employee/leaves", icon: CalendarDays },
];

export const adminNav: NavItem[] = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },

  { title: "Candidate Management", url: "/admin/candidates", icon: Users },

  { title: "Employee Management", url: "/admin/employees", icon: UserCheck },

  { title: "Organization Structure", url: "/admin/org-structure", icon: Users },

  { title: "Attendance", url: "/admin/attendance", icon: CalendarCheck },

  { title: "Leave Requests", url: "/admin/leaves", icon: CalendarDays },

  { title: "Notifications", url: "/admin/notifications", icon: Bell },

  { title: "Reports", url: "/admin/reports", icon: BarChart3 },

  { title: "Settings", url: "/admin/settings", icon: Settings },
];


