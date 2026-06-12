import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/org-structure")({
  component: OrgStructurePage,
});



function OrgStructurePage() {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [roles, setRoles] = useState([
    {
      department: "Management",
      subDepartment: "Executive",
      designation: "CEO",
    },
    {
      department: "Technical Delivery",
      subDepartment: "Delivery",
      designation: "Delivery Head",
    },
    {
      department: "Technical",
      subDepartment: "SAP",
      designation: "Technical Head",
    },
    {
      department: "SAP",
      subDepartment: "SAP ABAP",
      designation: "Sr ABAP Consultant",
    },
    {
      department: "SAP",
      subDepartment: "SAP ABAP",
      designation: "Jr ABAP Consultant",
    },
    {
      department: "Support",
      subDepartment: "Human Resource",
      designation: "HR Manager",
    },
  ]);

  const [department, setDepartment] = useState("");
  const [subDepartment, setSubDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  return (
    <RoleLayout items={adminNav} role="Admin" user="Admin User">
      <PageHeader
        title="Organization Structure"
        description="Manage departments and roles."
        action={
         <Button
  onClick={() => setOpen(true)}
  className="bg-[#F58220] hover:bg-[#D96E12]"
>
  <Plus className="h-4 w-4 mr-2" />
  Create Role
</Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Sub Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {roles.map((role, index) => (
                <TableRow key={index}>
  <TableCell>{role.department}</TableCell>
  <TableCell>{role.subDepartment}</TableCell>
  <TableCell>{role.designation}</TableCell>

  <TableCell>
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          setDepartment(role.department);
          setSubDepartment(role.subDepartment);
          setDesignation(role.designation);

          setEditIndex(index);
          setOpen(true);
        }}
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className="text-red-600"
        onClick={() => {
          const updatedRoles = roles.filter(
            (_, i) => i !== index
          );

          setRoles(updatedRoles);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </TableCell>
</TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
            </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
  {editIndex !== null ? "Edit Role" : "Create New Role"}
</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
  placeholder="Department"
  value={department}
  onChange={(e) => setDepartment(e.target.value)}
/>

            <Input
  placeholder="Sub Department"
  value={subDepartment}
  onChange={(e) => setSubDepartment(e.target.value)}
/>

            <Input
  placeholder="Designation"
  value={designation}
  onChange={(e) => setDesignation(e.target.value)}
/>

            <Button
  className="w-full"
  onClick={() => {
    if (editIndex !== null) {
  const updatedRoles = [...roles];

  updatedRoles[editIndex] = {
    department,
    subDepartment,
    designation,
  };

  setRoles(updatedRoles);
} else {
  const newRole = {
    department,
    subDepartment,
    designation,
  };

  setRoles([...roles, newRole]);
}

    setDepartment("");
    setSubDepartment("");
    setDesignation("");

    setEditIndex(null);
    setOpen(false);
  }}
>
  Save Role
</Button>
          </div>
        </DialogContent>
      </Dialog>

    </RoleLayout>
  );
}
