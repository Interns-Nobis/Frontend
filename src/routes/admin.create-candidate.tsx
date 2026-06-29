import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { RoleLayout } from "@/components/hrms/RoleLayout";
import { adminNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/create-candidate")({
  component: CreateCandidate,
});

function CreateCandidate() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  const handleCreateCandidate = async () => {
    if (
      !name ||
      !email ||
      !mobile ||
      !dob ||
      !department ||
      !designation
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/candidate/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            mobile,
            dob,
            department,
            designation,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create candidate");
      }

      const data = await response.json();

      alert(
        `Candidate Created Successfully

Form ID: ${data.formId}

Temporary Password: ${data.password}`
      );

      setName("");
      setEmail("");
      setMobile("");
      setDob("");
      setDepartment("");
      setDesignation("");
    } catch (error) {
      console.error(error);

      alert(
        "Backend not connected yet.\n\nFrontend is ready and waiting for API."
      );
    }
  };

  return (
    <RoleLayout items={adminNav} role="Admin" user="Admin User">
      <PageHeader
        title="Create Candidate"
        description="Create a new candidate account."
      />

      <Card className="max-w-3xl">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label>Candidate Name</Label>
            <Input
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="candidate@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label>Mobile Number</Label>
            <Input
              placeholder="9876543210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          <div>
            <Label>Date of Birth</Label>
            <Input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <div>
            <Label>Department</Label>
            <Input
              placeholder="IT"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <div>
            <Label>Designation</Label>
            <Input
              placeholder="Software Engineer"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-[#F58220] hover:bg-[#D96E12]"
            onClick={handleCreateCandidate}
          >
            Create Candidate
          </Button>
        </CardContent>
      </Card>
    </RoleLayout>
  );
}