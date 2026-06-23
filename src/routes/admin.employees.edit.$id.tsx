import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { RoleLayout } from "@/components/hrms/RoleLayout";
import { adminNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute(
  "/admin/employees/edit/$id"
)({
  component: EditEmployee,
});

function EditEmployee() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [employeeName, setEmployeeName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [subDepartment, setSubDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [reportingManager, setReportingManager] = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/employees/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEmployeeName(data.employee_name || "");
        setEmail(data.email || "");
        setDepartment(data.department || "");
        setSubDepartment(data.sub_department || "");
        setDesignation(data.designation || "");
        setReportingManager(data.reporting_manager || "");
      });
  }, [id]);

  const updateEmployee = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/employees/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: employeeName,
            email,
            department,
            sub_department: subDepartment,
            designation,
            reporting_manager: reportingManager,
          }),
        }
      );

      const data = await response.json();

      alert(data.message);

      navigate({
        to: "/admin/employees",
      });
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  return (
    <RoleLayout items={adminNav} role="Admin" user="Admin User">
      <PageHeader
        title="Edit Employee"
        description={id}
      />

      <Card className="max-w-4xl">
        <CardContent className="p-6 space-y-4">

          <div>
            <Label>Employee Name</Label>
            <Input
              value={employeeName}
              onChange={(e) =>
                setEmployeeName(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Department</Label>
            <Input
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Sub Department</Label>
            <Input
              value={subDepartment}
              onChange={(e) =>
                setSubDepartment(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Designation</Label>
            <Input
              value={designation}
              onChange={(e) =>
                setDesignation(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Reporting Manager</Label>
            <Input
              value={reportingManager}
              onChange={(e) =>
                setReportingManager(e.target.value)
              }
            />
          </div>

          <Button
            className="w-full"
            onClick={updateEmployee}
          >
            Update Employee
          </Button>

        </CardContent>
      </Card>
    </RoleLayout>
  );
}