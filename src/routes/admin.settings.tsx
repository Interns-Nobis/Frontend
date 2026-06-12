import { createFileRoute } from "@tanstack/react-router";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { adminNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/settings")({
  component: () => (
    <RoleLayout items={adminNav} role="Admin" user="Admin User">
      <PageHeader title="Settings" description="Manage profile, organization, theme and notifications." />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Admin Profile</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5"><Label>Full Name</Label><Input defaultValue="Admin User" /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" defaultValue="admin@company.com" /></div>
            <div className="space-y-1.5"><Label>Phone</Label><Input defaultValue="+91 99000 00001" /></div>
            <Button>Save Profile</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Organization Information</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5"><Label>Company Name</Label><Input defaultValue="Acme Corp" /></div>
            <div className="space-y-1.5"><Label>Website</Label><Input defaultValue="https://acme.com" /></div>
            <div className="space-y-1.5"><Label>Address</Label><Input defaultValue="Bangalore, India" /></div>
            <Button>Update Organization</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Theme Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Dark Mode</Label>
              <Switch />
            </div>
            <div className="space-y-1.5">
              <Label>Accent Color</Label>
              <Select defaultValue="blue">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Corporate Blue</SelectItem>
                  <SelectItem value="indigo">Indigo</SelectItem>
                  <SelectItem value="emerald">Emerald</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Notification Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              "Email — New candidate registrations",
              "Email — Leave requests",
              "In-app — Approval reminders",
              "SMS — Critical alerts",
            ].map((l) => (
              <div key={l} className="flex items-center justify-between">
                <Label className="font-normal">{l}</Label>
                <Switch defaultChecked={!l.includes("SMS")} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  ),
});
