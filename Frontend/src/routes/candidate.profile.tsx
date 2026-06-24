import { createFileRoute } from "@tanstack/react-router";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { candidateNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function Field({ label, value, type = "text" }: { label: string; value: string; type?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input defaultValue={value} type={type} />
    </div>
  );
}

export const Route = createFileRoute("/candidate/profile")({
  component: () => (
    <RoleLayout items={candidateNav} role="Candidate" user="Aarav Sharma">
      <PageHeader title="My Profile" description="Keep your information up to date." />
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <Field label="Full Name" value="Aarav Sharma" />
            <Field label="Email" value="aarav.sharma@example.com" type="email" />
            <Field label="Mobile" value="+91 98765 43210" />
            <Field label="Date of Birth" value="1998-04-12" type="date" />
            <div className="md:col-span-2 space-y-1.5">
              <Label>Address</Label>
              <Textarea defaultValue="HSR Layout, Bangalore, Karnataka 560102" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Education Information</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <Field label="Degree" value="B.Tech Computer Science" />
            <Field label="College" value="IIT Bombay" />
            <Field label="Year of Passing" value="2020" />
            <Field label="Percentage / CGPA" value="85%" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Employment Information</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <Field label="Previous Company" value="Infosys" />
            <Field label="Designation" value="Software Engineer" />
            <Field label="Experience" value="3 years" />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-3">
          <Button variant="outline">Save Draft</Button>
          <Button>Update Profile</Button>
        </div>
      </div>
    </RoleLayout>
  ),
});
