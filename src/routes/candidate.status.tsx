import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { candidateNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";
import { Timeline, type TimelineStep } from "@/components/hrms/Timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/hrms/StatusBadge";
import { AlertCircle, FileEdit } from "lucide-react";
import { useDB } from "@/data/store";
import type { CandidateStatus } from "@/data/types";

export const Route = createFileRoute("/candidate/status")({ component: StatusPage });

const FLOW: CandidateStatus[] = [
  "Submitted",
  "Under Review",
  "HR Manager Approved",
  "HoD Approved",
  "Offer Released",
];

function buildTimeline(current: CandidateStatus): TimelineStep[] {
  if (current === "Rejected") {
    return [
      { label: "Submitted", state: "done" },
      { label: "Under Review", state: "done" },
      { label: "Rejected — see remarks", state: "rejected" },
    ];
  }
  if (current === "Correction Requested") {
    return [
      { label: "Submitted", state: "done" },
      { label: "Under Review", state: "done" },
      { label: "Correction Requested — action needed", state: "current" },
      { label: "HR Manager Approval", state: "pending" },
      { label: "HoD Approval", state: "pending" },
      { label: "Offer Released", state: "pending" },
    ];
  }
  const idx = FLOW.indexOf(current);
  return FLOW.map((s, i) => ({
    label: s,
    state: i < idx ? "done" : i === idx ? "current" : "pending",
  }));
}

function StatusPage() {
  const nav = useNavigate();
  const user = useDB((d) => d.currentUser);
  const candidate = useDB((d) =>
    user?.candidateId ? d.candidates.find((c) => c.id === user.candidateId) : d.candidates[0]
  );
  const status = (candidate?.status ?? "Submitted") as CandidateStatus;
  const canResubmit = status === "Rejected" || status === "Correction Requested";

  return (
    <RoleLayout items={candidateNav} role="Candidate" user={candidate?.name ?? "Candidate"}>
      <PageHeader title="Application Status" description="Follow your onboarding progress in real time." />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Timeline</CardTitle>
            <StatusBadge status={status} />
          </CardHeader>
          <CardContent>
            <Timeline steps={buildTimeline(status)} />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />HR Remarks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={candidate?.remarks ?? ""}
                placeholder="No remarks yet from the reviewer."
                readOnly
                className="resize-none"
                rows={5}
              />
            </CardContent>
          </Card>

          {canResubmit && (
            <Card className="border-warning/40">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileEdit className="h-4 w-4 text-warning-foreground" />
                  {status === "Rejected" ? "Edit & Resubmit" : "Action Required"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {status === "Rejected"
                    ? "Your application was rejected. Update the requested sections and resubmit."
                    : "HR has requested corrections. Please update and resubmit your application."}
                </p>
                <Button className="w-full" onClick={() => nav({ to: "/candidate/onboarding" })}>
                  Open Onboarding
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="text-base">Status History</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {(candidate?.history ?? []).slice().reverse().map((h) => (
                <div key={h.id} className="text-sm flex items-start justify-between gap-2 border-b last:border-0 pb-2 last:pb-0">
                  <div>
                    <div className="font-medium">{h.status}</div>
                    {h.remarks && <div className="text-xs text-muted-foreground">{h.remarks}</div>}
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{new Date(h.at).toLocaleDateString()}</div>
                </div>
              ))}
              {(!candidate?.history || candidate.history.length === 0) && (
                <p className="text-sm text-muted-foreground">No history yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleLayout>
  );
}
