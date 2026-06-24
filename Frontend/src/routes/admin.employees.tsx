import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { adminNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/hrms/StatusBadge";
import { Search, Eye, Pencil, Ban, Plus, Shield } from "lucide-react";
import { mockEmployees } from "@/data/mockData";

export const Route = createFileRoute("/admin/employees")({
  component: EmployeesPage,
});

function EmployeesPage() {
  const nav = useNavigate();

  return (
    <RoleLayout items={adminNav} role="Admin" user="Admin User">
      <PageHeader
        title="Employee Management"
        description="Manage all active employees."
        action={
  <Button
    onClick={() => nav({ to: "/admin/create-employee" })}
    className="bg-[#F58220] hover:bg-[#D96E12]"
  >
    <Plus className="h-4 w-4 mr-2" />
    Add Employee
  </Button>
}
      />
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input placeholder="Search employees..." className="pl-9" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
<TableHead className="hidden md:table-cell">Sub Department</TableHead>
<TableHead className="hidden md:table-cell">Designation</TableHead>
                <TableHead className="hidden lg:table-cell">Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEmployees.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-xs">{e.id}</TableCell>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{e.department}</TableCell>

<TableCell className="hidden md:table-cell">
  {e.subDepartment}
</TableCell>

<TableCell className="hidden md:table-cell">
  {e.designation}
</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">{e.email}</TableCell>
                  <TableCell><StatusBadge status={e.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
  size="sm"
  variant="ghost"
  onClick={() =>
    nav({
      to: "/admin/employees/$id",
      params: { id: e.id },
    })
  }
>
  <Eye className="h-4 w-4" />
</Button>
                     <Button size="sm" variant="ghost">
  <Pencil className="h-4 w-4" />
</Button>

<Button
  size="sm"
  variant="ghost"
  onClick={() =>
    nav({
      to: "/admin/permissions",
      search: {
        employeeId: e.id,
        employeeName: e.name,
      },
    })
  }
>
  <Shield className="h-4 w-4 text-blue-600" />
</Button>



<Button size="sm" variant="ghost" className="text-red-600">
  <Ban className="h-4 w-4" />
</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
        </RoleLayout>
  );
}
