import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchDashboard } from "@/services/dashboard";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { adminNav } from "@/components/hrms/navConfigs";
import { DashboardCard } from "@/components/hrms/DashboardCard";
import { PageHeader } from "@/components/hrms/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, CheckCircle2, XCircle, UserCheck } from "lucide-react";
export const Route = createFileRoute("/admin/dashboard")({
  component: () => {
  const [dashboard, setDashboard] = useState<any>(null);

 useEffect(() => {
  fetchDashboard()
    .then(setDashboard)
    .catch(console.error);

 
}, []);

  if (!dashboard) {
    return <div>Loading...</div>;
  }

  return (
    <RoleLayout items={adminNav} role="Admin" user="Admin User">
      <PageHeader title="Admin Dashboard" description="Organization-wide overview." />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
  <DashboardCard
    label="Total Employees"
    value={dashboard.total_employees.toString()}
    icon={Users}
    accent="text-blue-600 bg-blue-100"
  />

  <DashboardCard
    label="Present"
    value={dashboard.present_employees.toString()}
    icon={CheckCircle2}
    accent="text-emerald-600 bg-emerald-100"
  />

  <DashboardCard
    label="Absent"
    value={dashboard.absent_employees.toString()}
    icon={XCircle}
    accent="text-red-600 bg-red-100"
  />

  <DashboardCard
    label="WFH"
    value={dashboard.wfh_employees.toString()}
    icon={Clock}
    accent="text-amber-600 bg-amber-100"
  />

  <DashboardCard
    label="On Site"
    value={dashboard.onsite_employees.toString()}
    icon={UserCheck}
    accent="text-violet-600 bg-violet-100"
  />
</div>

    </RoleLayout>
  );
},
});
