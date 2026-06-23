import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { UserCircle2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/candidate/login")({
  component: CandidateLogin,
});

function CandidateLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const response = await fetch(
        "http://192.168.29.88:8000/candidate/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem(
        "candidate_id",
        data.candidate_id
      );

      navigate({
        to: "/candidate/dashboard",
      });

    } catch (error) {
      console.error(error);
      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">

      <Card className="w-full max-w-md">

        <CardHeader className="text-center">

          <div className="mx-auto mb-3">
            <UserCircle2 className="h-12 w-12" />
          </div>

          <CardTitle>
            Candidate Login
          </CardTitle>

          <CardDescription>
            Sign in to continue onboarding
          </CardDescription>

        </CardHeader>

        <CardContent className="space-y-4">

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
            <Label>Password</Label>

            <Input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <Button
            className="w-full"
            onClick={login}
          >
            Login
          </Button>

          <Link
            to="/"
            className="flex justify-center text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>

        </CardContent>

      </Card>

    </div>
  );
}