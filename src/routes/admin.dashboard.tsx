import { createFileRoute } from "@tanstack/react-router";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { adminNav } from "@/components/hrms/navConfigs";
import { DashboardCard } from "@/components/hrms/DashboardCard";
import { PageHeader } from "@/components/hrms/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, CheckCircle2, XCircle, UserCheck } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from "recharts";
import { statusDistribution, departmentDistribution } from "@/data/mockData";

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

export const Route = createFileRoute("/admin/dashboard")({
  component: () => (
    <RoleLayout items={adminNav} role="Admin" user="Admin User">
      <PageHeader title="Admin Dashboard" description="Organization-wide overview." />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <DashboardCard label="Total Candidates" value="69" icon={Users} accent="text-blue-600 bg-blue-100" />
        <DashboardCard label="Pending Reviews" value="18" icon={Clock} accent="text-amber-600 bg-amber-100" />
        <DashboardCard label="Approved" value="24" icon={CheckCircle2} accent="text-emerald-600 bg-emerald-100" />
        <DashboardCard label="Rejected" value="6" icon={XCircle} accent="text-red-600 bg-red-100" />
        <DashboardCard label="Total Employees" value="84" icon={UserCheck} accent="text-violet-600 bg-violet-100" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Candidate Status Distribution</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDistribution} dataKey="value" nameKey="name" outerRadius={100} label>
                  {statusDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Employees by Department</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  ),
});
