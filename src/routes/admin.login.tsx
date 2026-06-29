import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — HRMS" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sidebar via-slate-900 to-indigo-950 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-3">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl">Admin Sign In</CardTitle>
          <CardDescription>Secure access for HRMS administrators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Admin Email</Label>
            <Input type="email" defaultValue="admin@company.com" />
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input type="password" defaultValue="admin123" />
          </div>
          <Button className="w-full" onClick={() => nav({ to: "/admin/dashboard" })}>Login</Button>
          <Link to="/" className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to portal
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
