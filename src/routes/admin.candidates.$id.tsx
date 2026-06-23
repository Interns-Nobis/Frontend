import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

import { RoleLayout } from "@/components/hrms/RoleLayout";
import { adminNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/hrms/StatusBadge";

import {
  ArrowLeft,
  Check,
  X,
} from "lucide-react";

export const Route = createFileRoute(
  "/admin/candidates/$id"
)({
  component: CandidateDetail,
});

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="font-medium text-sm">
        {value}
      </span>
    </div>
  );
}

function CandidateDetail() {
  const { id } = Route.useParams();
  console.log("Candidate ID:", id);

  const [candidate, setCandidate] =
    useState<any>(null);

  const [remarks, setRemarks] =
    useState("");

  useEffect(() => {
    fetch(
      `http://192.168.29.88:8000/candidate/${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCandidate(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  const approve = async () => {
    try {
      const response = await fetch(
        `http://192.168.29.88:8000/candidate/hr-approve/${id}`,
        {
          method: "PUT",
        }
      );

      const data =
        await response.json();

      alert(data.message);

      const updated =
        await fetch(
          `http://192.168.29.88:8000/candidate/${id}`
        );

      setCandidate(
        await updated.json()
      );
    } catch (error) {
      console.error(error);
    }
  };

  const reject = async () => {
    if (!remarks) {
      alert(
        "Please enter remarks"
      );
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.29.88:8000/candidate/reject/${id}?remarks=${remarks}`,
        {
          method: "PUT",
        }
      );

      const data =
        await response.json();

      alert(data.message);

      const updated =
        await fetch(
          `http://192.168.29.88:8000/candidate/${id}`
        );

      setCandidate(
        await updated.json()
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (!candidate) {
    return (
      <RoleLayout
        items={adminNav}
        role="Admin"
        user="Admin User"
      >
        <div className="p-6">
          Loading Candidate...
        </div>
      </RoleLayout>
    );
  }

  return (
    <RoleLayout
      items={adminNav}
      role="Admin"
      user="Admin User"
    >
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="mb-3"
      >
        <Link to="/admin/candidates">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Candidates
        </Link>
      </Button>

      <PageHeader
        title={candidate.name}
        description={
          candidate.candidate_id
        }
        action={
          <StatusBadge
            status={
              candidate.status
            }
          />
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">

          <Card>
            <CardHeader>
              <CardTitle>
                Candidate Information
              </CardTitle>
            </CardHeader>

            <CardContent>

              <Row
                label="Candidate ID"
                value={
                  candidate.candidate_id
                }
              />

              <Row
                label="Name"
                value={
                  candidate.name
                }
              />

              <Row
                label="Email"
                value={
                  candidate.email
                }
              />

              <Row
                label="Mobile"
                value={
                  candidate.mobile
                }
              />

              <Row
                label="Date Of Birth"
                value={
                  candidate.dob
                }
              />

              <Row
                label="Department"
                value={
                  candidate.department
                }
              />

              <Row
                label="Designation"
                value={
                  candidate.designation
                }
              />

              <Row
                label="Status"
                value={
                  candidate.status
                }
              />

              <Row
                label="Remarks"
                value={
                  candidate.remarks ||
                  "-"
                }
              />

            </CardContent>
          </Card>

        </div>

        <div>

          <Card>
            <CardHeader>
              <CardTitle>
                Candidate Actions
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">

              <Button
                onClick={approve}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>

              <Textarea
                placeholder="Enter rejection remarks"
                value={remarks}
                onChange={(e) =>
                  setRemarks(
                    e.target.value
                  )
                }
              />

              <Button
                variant="destructive"
                className="w-full"
                onClick={reject}
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>

            </CardContent>
          </Card>

        </div>

      </div>
    </RoleLayout>
  );
}