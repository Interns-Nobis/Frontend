import { createFileRoute } from "@tanstack/react-router";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { adminNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, CalendarDays, Users, UserCheck, FileSpreadsheet, FileText } from "lucide-react";

const reports = [
  { label: "Attendance Report", desc: "Monthly attendance breakdown by department.", icon: CalendarCheck, accent: "text-emerald-600 bg-emerald-100" },
  { label: "Leave Report", desc: "Leave balances and trends across employees.", icon: CalendarDays, accent: "text-blue-600 bg-blue-100" },
  { label: "Candidate Report", desc: "Pipeline and conversion of candidates.", icon: Users, accent: "text-amber-600 bg-amber-100" },
  { label: "Employee Report", desc: "Headcount and department distribution.", icon: UserCheck, accent: "text-violet-600 bg-violet-100" },
];

export const Route = createFileRoute("/admin/reports")({
  component: () => (
    <RoleLayout items={adminNav} role="Admin" user="Admin User">
      <PageHeader title="Reports" description="Generate and export operational reports." />
      <div className="grid sm:grid-cols-2 gap-4">
        {reports.map((r) => (
          <Card key={r.label} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${r.accent}`}>
                  <r.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>{r.label}</CardTitle>
                  <CardDescription>{r.desc}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" className="flex-1"><FileText className="h-4 w-4 mr-2" />Export PDF</Button>
              <Button className="flex-1"><FileSpreadsheet className="h-4 w-4 mr-2" />Export Excel</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </RoleLayout>
  ),
});
