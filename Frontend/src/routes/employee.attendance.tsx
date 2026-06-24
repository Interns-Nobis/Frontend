import { createFileRoute } from "@tanstack/react-router";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { employeeNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";
import { DashboardCard } from "@/components/hrms/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/hrms/StatusBadge";
import { CalendarCheck, CalendarX, CalendarClock } from "lucide-react";

const days = Array.from({ length: 20 }, (_, i) => {
  const d = new Date(2025, 4, i + 1);
  const r = i % 7;
  const status = r === 5 ? "Leave" : r === 6 ? "Absent" : "Present";
  return { date: d.toISOString().split("T")[0], status };
});

export const Route = createFileRoute("/employee/attendance")({
  component: () => (
    <RoleLayout items={employeeNav} role="Employee" user="Ananya Rao">
      <PageHeader title="My Attendance" description="May 2025" />
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <DashboardCard label="Present Days" value="18" icon={CalendarCheck} accent="text-emerald-600 bg-emerald-100" />
        <DashboardCard label="Absent Days" value="2" icon={CalendarX} accent="text-red-600 bg-red-100" />
        <DashboardCard label="Leave Days" value="3" icon={CalendarClock} accent="text-blue-600 bg-blue-100" />
      </div>
      <Card>
        <CardHeader><CardTitle>Daily Log</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {days.map((d) => (
                <TableRow key={d.date}>
                  <TableCell>{d.date}</TableCell>
                  <TableCell><StatusBadge status={d.status} /></TableCell>
                  <TableCell>{d.status === "Present" ? "09:12" : "—"}</TableCell>
                  <TableCell>{d.status === "Present" ? "18:30" : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </RoleLayout>
  ),
});
