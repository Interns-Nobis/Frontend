import {
  createFileRoute,
  useSearch,
} from "@tanstack/react-router";
import { useState } from "react";
import { saveEmployeePermissions, useDB } from "@/data/store";

import { RoleLayout } from "@/components/hrms/RoleLayout";
import { adminNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/admin/permissions")({
  validateSearch: (search: Record<string, unknown>) => ({
    employeeId: String(search.employeeId ?? ""),
    employeeName: String(search.employeeName ?? ""),
  }),
  component: PermissionsPage,
});

function PermissionsPage() {
  const search = useSearch({
    from: "/admin/permissions",
  });

  const savedPermissions = useDB(
    (d) => d.employeePermissions?.[search.employeeId]
  );

  const [permissions, setPermissions] = useState(
    savedPermissions ?? {
      dashboard: true,
      attendance: true,
      leave: true,
      reports: false,
      candidateManagement: false,
      employeeManagement: false,
      notifications: false,
      settings: false,
    }
  );
  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions({
      ...permissions,
      [key]: !permissions[key],
    });
  };

  return (
    <RoleLayout items={adminNav} role="Admin" user="Admin User">
    <PageHeader
  title="Permission Management"
  description={`Employee: ${search.employeeName} (${search.employeeId})`}
/>

      <Card>
        <CardHeader>
          <CardTitle>Employee Permissions</CardTitle>
        </CardHeader>


            <CardContent className="space-y-4">

  <div className="rounded-lg border p-4 bg-muted/20">
    <p>
      <strong>Employee ID:</strong> {search.employeeId}
    </p>

    <p>
      <strong>Employee Name:</strong> {search.employeeName}
    </p>
  </div>

          <div className="flex items-center gap-3">
            <Checkbox
              checked={permissions.dashboard}
              onCheckedChange={() => togglePermission("dashboard")}
            />
            <span>Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              checked={permissions.attendance}
              onCheckedChange={() => togglePermission("attendance")}
            />
            <span>Attendance</span>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              checked={permissions.leave}
              onCheckedChange={() => togglePermission("leave")}
            />
            <span>Leave Management</span>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              checked={permissions.reports}
              onCheckedChange={() => togglePermission("reports")}
            />
            <span>Reports</span>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              checked={permissions.candidateManagement}
              onCheckedChange={() =>
                togglePermission("candidateManagement")
              }
            />
            <span>Candidate Management</span>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              checked={permissions.employeeManagement}
              onCheckedChange={() =>
                togglePermission("employeeManagement")
              }
            />
            <span>Employee Management</span>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              checked={permissions.notifications}
              onCheckedChange={() =>
                togglePermission("notifications")
              }
            />
            <span>Notifications</span>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              checked={permissions.settings}
              onCheckedChange={() => togglePermission("settings")}
            />
            <span>Settings</span>
          </div>

          <Button
  className="mt-4"
  onClick={() => {
    saveEmployeePermissions(
      search.employeeId,
      permissions
    );

    alert("Permissions Saved");
  }}
>
  Save Permissions
</Button>

        </CardContent>
      </Card>
    </RoleLayout>
  );
}