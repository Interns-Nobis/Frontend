import { createFileRoute } from "@tanstack/react-router";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { employeeNav } from "@/components/hrms/navConfigs";
import { DashboardCard } from "@/components/hrms/DashboardCard";
import { PageHeader } from "@/components/hrms/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, CalendarCheck, CalendarDays, Clock } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const attendance = [
  { name: "Present", value: 18, color: "#10b981" },
  { name: "Absent", value: 2, color: "#ef4444" },
  { name: "Leave", value: 3, color: "#3b82f6" },
];

export const Route = createFileRoute("/employee/dashboard")({
  component: () => (
    <RoleLayout items={employeeNav} role="Employee" user="Ananya Rao">
      <PageHeader title="Welcome, Ananya" description="Here's a snapshot of your work this month." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard label="Employee ID" value="EMP001" icon={BadgeCheck} accent="text-primary bg-primary/10" />
        <DashboardCard label="Attendance" value="92%" icon={CalendarCheck} accent="text-emerald-600 bg-emerald-100" hint="This month" />
        <DashboardCard label="Available Leaves" value="12" icon={CalendarDays} accent="text-blue-600 bg-blue-100" hint="CL + SL + EL" />
        <DashboardCard label="Pending Requests" value="1" icon={Clock} accent="text-amber-600 bg-amber-100" />
      </div>
      <Card>
        <CardHeader><CardTitle>Monthly Attendance Summary</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={attendance} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50}>
                    {attendance.map((e) => <Cell key={e.name} fill={e.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {attendance.map((a) => (
                <div key={a.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: a.color }} />
                    <span className="font-medium">{a.name} Days</span>
                  </div>
                  <span className="text-2xl font-semibold">{a.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </RoleLayout>
  ),
});
