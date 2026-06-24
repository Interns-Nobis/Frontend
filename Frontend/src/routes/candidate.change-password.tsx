import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { KeyRound, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { changePassword, useDB } from "@/data/store";

export const Route = createFileRoute("/candidate/change-password")({
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const nav = useNavigate();
  const user = useDB((d) => d.currentUser);
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");

  const handle = () => {
    if (!user?.email) {
      toast.error("No active session. Please log in again.");
      nav({ to: "/" });
      return;
    }
    if (pwd.length < 8) return toast.error("Password must be at least 8 characters.");
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return toast.error("Use a mix of uppercase letters and numbers.");
    if (pwd !== confirm) return toast.error("Passwords do not match.");
    changePassword(user.email, pwd);
    toast.success("Password updated. Welcome!");
    nav({ to: "/candidate/onboarding" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-indigo-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
            <KeyRound className="h-6 w-6" />
          </div>
          <CardTitle>Set a New Password</CardTitle>
          <CardDescription>
            You're using a temporary password. Choose a permanent one to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label>New Password</Label>
            <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="At least 8 characters" />
          </div>
          <div className="space-y-1.5">
            <Label>Confirm Password</Label>
            <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2 flex gap-2">
            <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
            Use a mix of uppercase, lowercase, and numbers. Avoid reusing your DOB.
          </div>
          <Button className="w-full" onClick={handle}>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}