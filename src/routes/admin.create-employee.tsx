import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { adminNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/create-employee")({
  component: CreateEmployee,
});

function CreateEmployee() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeeName, setEmployeeName] = useState("");
const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
const [subDepartment, setSubDepartment] = useState("");
const [designation, setDesignation] = useState("");
const [employee, setEmployee] = useState<any>(null);

  return (
    <RoleLayout items={adminNav} role="Admin" user="Admin User">
      <PageHeader
        title="Create Employee"
        description="Create a new employee account."
      />

      <Card className="max-w-4xl">
        <CardContent className="p-6 space-y-4">

          <div>
            <Label>Employee Name</Label>
            <Input
  placeholder="Enter full name"
  value={employeeName}
  onChange={(e) => setEmployeeName(e.target.value)}
/>
          </div>

          <div>
            <Label>Company Email</Label>
            <Input
  placeholder="employee@nobistechnologies.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
          </div>

          <div>
  <Label>Department</Label>

  <Select
  value={department}
  onValueChange={(value) => {
    setDepartment(value);
    setSubDepartment("");
  }}
>
    <SelectTrigger>
      <SelectValue placeholder="Select Department" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="management">
        Management
      </SelectItem>

      <SelectItem value="technical">
        Technical
      </SelectItem>

      <SelectItem value="sap">
        SAP
      </SelectItem>

      <SelectItem value="support">
        Support
      </SelectItem>
    </SelectContent>
  </Select>
</div>

          <div>
  <Label>Sub Department</Label>

  <Select
  value={subDepartment}
  onValueChange={setSubDepartment}
>
    <SelectTrigger>
      <SelectValue placeholder="Select Sub Department" />
    </SelectTrigger>

    <SelectContent>

  {department === "management" && (
    <>
      <SelectItem value="executive">
        Executive
      </SelectItem>
    </>
  )}

  {department === "technical" && (
    <>
      <SelectItem value="delivery">
        Delivery
      </SelectItem>
    </>
  )}

  {department === "sap" && (
    <>
      <SelectItem value="sap-abap">
        SAP ABAP
      </SelectItem>

      <SelectItem value="fico">
        SAP FICO
      </SelectItem>

      <SelectItem value="basis">
        SAP BASIS
      </SelectItem>
    </>
  )}

  {department === "support" && (
    <>
      <SelectItem value="human-resource">
        Human Resource
      </SelectItem>

      <SelectItem value="finance">
        Finance
      </SelectItem>

      <SelectItem value="marketing">
        Marketing
      </SelectItem>

      <SelectItem value="sales">
        Sales
      </SelectItem>
    </>
  )}

</SelectContent>
  </Select>
</div>

          <div>
  <Label>Designation</Label>

  <Select
  value={designation}
  onValueChange={setDesignation}
>
    <SelectTrigger>
      <SelectValue placeholder="Select Designation" />
    </SelectTrigger>

    <SelectContent>

  {subDepartment === "human-resource" && (
    <SelectItem value="hr-manager">
      HR Manager
    </SelectItem>
  )}

  {subDepartment === "sap-abap" && (
    <>
      <SelectItem value="sr-abap">
        Sr ABAP Consultant
      </SelectItem>

      <SelectItem value="jr-abap">
        Jr ABAP Consultant
      </SelectItem>
    </>
  )}

  {subDepartment === "fico" && (
    <>
      <SelectItem value="sr-fico">
        Sr FICO Consultant
      </SelectItem>

      <SelectItem value="jr-fico">
        Jr FICO Consultant
      </SelectItem>
    </>
  )}

  {subDepartment === "basis" && (
    <SelectItem value="basis">
      BASIS Consultant
    </SelectItem>
  )}

</SelectContent>
  </Select>
</div>
<div>
  <Label>Reporting Manager</Label>

  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Select Reporting Manager" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="ceo">
        CEO
      </SelectItem>

      <SelectItem value="delivery-head">
        Delivery Head
      </SelectItem>

      <SelectItem value="technical-head">
        Technical Head
      </SelectItem>

      <SelectItem value="sr-abap">
        Sr ABAP Consultant
      </SelectItem>

      <SelectItem value="hr-manager">
        HR Manager
      </SelectItem>
    </SelectContent>
  </Select>
</div>

          <Button
            className="w-full bg-[#F58220] hover:bg-[#D96E12]"
            onClick={() => {
             const newEmployee = {
  id: `EMP${employees.length + 1}`,
  employeeName,
  email,
  department,
  subDepartment,
  designation,
};

setEmployee(newEmployee);

setEmployees([
  ...employees,
  newEmployee,
]);
            }}
          >
            Create Employee
          </Button>

        </CardContent>
      </Card>
      {employees.length > 0 && (
  <Card className="max-w-4xl mt-4">
    <CardContent className="p-6">

      <h3 className="font-bold text-lg mb-4">
        Employee List
      </h3>

      {employees.map((emp) => (
        <div
          key={emp.id}
          className="border-b py-2"
        >
          <p>
            <strong>ID:</strong> {emp.id}
          </p>

          <p>
            <strong>Name:</strong> {emp.employeeName}
          </p>

          <p>
            <strong>Email:</strong> {emp.email}
          </p>

          <p>
            <strong>Department:</strong> {emp.department}
          </p>

          <p>
            <strong>Designation:</strong> {emp.designation}
          </p>
        </div>
      ))}

    </CardContent>
  </Card>
)}
    </RoleLayout>
  );
}