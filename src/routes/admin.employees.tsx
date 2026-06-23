import { useEffect, useState } from "react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";

import { RoleLayout } from "@/components/hrms/RoleLayout";
import { adminNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Pencil, Ban, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/employees")({
  component: EmployeesPage,
});

function EmployeesPage() {
  const nav = useNavigate();

  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/employees/")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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
            <Input
              placeholder="Search employees..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">Loading employees...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Sub Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {employees.map((e) => (
                  <TableRow key={e.employee_id}>
                    <TableCell>{e.employee_id}</TableCell>
                    <TableCell>{e.employee_name}</TableCell>
                    <TableCell>{e.department}</TableCell>
                    <TableCell>{e.sub_department}</TableCell>
                    <TableCell>{e.designation}</TableCell>
                    <TableCell>{e.email}</TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            window.location.href =
                              `/admin/employees/${e.employee_id}`;
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
  size="sm"
  variant="ghost"
  onClick={() => {
    window.location.href =
      `/admin/employees/edit/${e.employee_id}`;
  }}
>
  <Pencil className="h-4 w-4" />
</Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                          onClick={async () => {
                            const confirmDelete =
                              window.confirm(
                                `Delete ${e.employee_name}?`
                              );

                            if (!confirmDelete) return;

                            try {
                              const response =
                                await fetch(
                                  `http://127.0.0.1:8000/employees/${e.employee_id}`,
                                  {
                                    method: "DELETE",
                                  }
                                );

                              const data =
                                await response.json();

                              alert(data.message);

                              setEmployees((prev) =>
                                prev.filter(
                                  (emp) =>
                                    emp.employee_id !==
                                    e.employee_id
                                )
                              );
                            } catch (error) {
                              console.error(error);
                              alert("Delete failed");
                            }
                          }}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>

                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Outlet />
    </RoleLayout>
  );
}