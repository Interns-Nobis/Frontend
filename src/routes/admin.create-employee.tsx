import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

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
  const navigate = useNavigate();

  const [employeeName, setEmployeeName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [subDepartment, setSubDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [reportingManager, setReportingManager] = useState("");

  const createEmployee = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/employees/",
        {
          method: "POST",
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

      if (!response.ok) {
        console.log(data);
        alert(JSON.stringify(data));
        return;
      }

      alert(data.message);

      navigate({
        to: "/admin/employees",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to create employee");
    }
  };

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
              onChange={(e) =>
                setEmployeeName(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Company Email</Label>
            <Input
              placeholder="employee@nobistechnologies.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Department</Label>

            <Select
              value={department}
              onValueChange={(value) => {
                setDepartment(value);
                setSubDepartment("");
                setDesignation("");
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
                  <SelectItem value="executive">
                    Executive
                  </SelectItem>
                )}

                {department === "technical" && (
                  <SelectItem value="delivery">
                    Delivery
                  </SelectItem>
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
                  <SelectItem value="HR Manager">
                    HR Manager
                  </SelectItem>
                )}

                {subDepartment === "sap-abap" && (
                  <>
                    <SelectItem value="Sr ABAP Consultant">
                      Sr ABAP Consultant
                    </SelectItem>

                    <SelectItem value="Jr ABAP Consultant">
                      Jr ABAP Consultant
                    </SelectItem>
                  </>
                )}

                {subDepartment === "fico" && (
                  <>
                    <SelectItem value="Sr FICO Consultant">
                      Sr FICO Consultant
                    </SelectItem>

                    <SelectItem value="Jr FICO Consultant">
                      Jr FICO Consultant
                    </SelectItem>
                  </>
                )}

                {subDepartment === "basis" && (
                  <SelectItem value="BASIS Consultant">
                    BASIS Consultant
                  </SelectItem>
                )}

                {subDepartment === "delivery" && (
                  <>
                    <SelectItem value="Team Lead">
                      Team Lead
                    </SelectItem>

                    <SelectItem value="Software Engineer">
                      Software Engineer
                    </SelectItem>
                  </>
                )}

              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Reporting Manager</Label>

            <Select
              value={reportingManager}
              onValueChange={setReportingManager}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Reporting Manager" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="CEO">
                  CEO
                </SelectItem>

                <SelectItem value="Delivery Head">
                  Delivery Head
                </SelectItem>

                <SelectItem value="Technical Head">
                  Technical Head
                </SelectItem>

                <SelectItem value="Sr ABAP Consultant">
                  Sr ABAP Consultant
                </SelectItem>

                <SelectItem value="HR Manager">
                  HR Manager
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full bg-[#F58220] hover:bg-[#D96E12]"
            onClick={createEmployee}
          >
            Create Employee
          </Button>

        </CardContent>
      </Card>
    </RoleLayout>
  );
}