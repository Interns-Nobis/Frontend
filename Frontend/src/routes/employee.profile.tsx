import { createFileRoute } from "@tanstack/react-router";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { employeeNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export const Route = createFileRoute("/employee/profile")({
  component: () => (
    <RoleLayout items={employeeNav} role="Employee" user="Ananya Rao">
      <PageHeader title="Employee Profile" />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-3">
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">AR</AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-semibold">Ananya Rao</h3>
            <p className="text-sm text-muted-foreground">Senior Engineer</p>
            <Badge className="mt-2">Engineering</Badge>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Employee Information</CardTitle></CardHeader>
          <CardContent>
            <Row label="Employee ID" value="EMP001" />
            <Row label="Full Name" value="Ananya Rao" />
            <Row label="Email" value="employee001@company.com" />
            <Row label="Department" value="Engineering" />
            <Row label="Designation" value="Senior Engineer" />
            <Row label="Date of Joining" value="March 1, 2022" />
            <Row label="Reporting Manager" value="Karthik Nair" />
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  ),
});
