import { createFileRoute } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ShieldCheck, Info } from "lucide-react";
import nobisLogo from "@/assets/Nobis.png";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HRMS Portal — Login & Registration" },
      { name: "description", content: "Modern HRMS portal for candidates, employees, and administrators." },
      { property: "og:title", content: "HRMS Portal" },
      { property: "og:description", content: "Manage candidates, employees, attendance and leaves in one place." },
    ],
  }),
  component: Index,
});

function Index() {
  const nav = useNavigate();
  const [candEmail, setCandEmail] = useState("");
  const [candPwd, setCandPwd] = useState("");

 const handleCandidateLogin = () => {
  nav({ to: "/candidate/dashboard" });
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-white to-[#fff4e8]">
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex flex-col items-start">
  <img
  src={nobisLogo}
  alt="NOBIS Technologies"
  className="h-24 w-auto"
/>

</div>

<Button
  className="bg-[#123D7A] hover:bg-[#0D2E5C] text-white"
  onClick={() => nav({ to: "/admin/login" })}
>
  <ShieldCheck className="h-4 w-4 mr-2" />
  Admin Login
</Button>

</div>
</header>

      <main className="max-w-7xl mx-auto px-4 py-10">
  <div className="text-center mb-10">
    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
      Welcome!
    </h1>

    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
      Sign in using the credentials provided by HR.
    </p>
  </div>

  <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Candidate Login */}
          <Card className="bg-white shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" />Candidate Login</CardTitle>
              <CardDescription>
  Use the Form ID and temporary password provided by HR.
</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Form ID</Label>

<Input
  placeholder="CAN2026001"
  value={candEmail}
  onChange={(e) => setCandEmail(e.target.value)}
/>
              </div>
              <div className="space-y-1.5">
                <Label>Password</Label>
              <Input
  type="password"
  placeholder="Temporary Password" value={candPwd} onChange={(e) => setCandPwd(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCandidateLogin()} />
              </div>
              <div className="text-xs text-muted-foreground flex gap-1.5 bg-blue-50 border border-blue-100 rounded-md p-2">
  <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-blue-600" />
  Form ID and temporary password are provided by HR. You will be required to change your password after first login.
</div>
              <Button
  className="w-full bg-[#123D7A] hover:bg-[#0D2E5C] text-white"
  onClick={handleCandidateLogin}
>
  Login
</Button>
            </CardContent>
          </Card>

          {/* Employee Login */}
          <Card className="bg-white shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-primary" />Employee Login</CardTitle>
              <CardDescription>Use your assigned company credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Company Email</Label>
                <Input type="email" placeholder="employee001@company.com" defaultValue="employee001@company.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Password</Label>
                <Input type="password" defaultValue="password" />
              </div>
              <Button
  className="w-full bg-[#123D7A] hover:bg-[#0D2E5C] text-white"
  onClick={() => nav({ to: "/employee/dashboard" })}
>
  Login
</Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-10 text-sm text-muted-foreground">
          Are you an administrator?{" "}
          <Link to="/admin/login" className="text-primary font-medium hover:underline">Admin Login →</Link>
        </div>
      </main>
    </div>
  );
}
