import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { adminNav } from "@/components/hrms/navConfigs";
import { PageHeader } from "@/components/hrms/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/hrms/StatusBadge";
import { DocumentCard } from "@/components/hrms/DocumentCard";
import { ArrowLeft, Check, X, FileEdit } from "lucide-react";
import { mockCandidates, mockDocuments } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";
import { updateCandidateStatus, requestCorrection, useDB } from "@/data/store";

export const Route = createFileRoute("/admin/candidates/$id")({
  component: CandidateDetail,
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between py-2.5 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium text-sm">{value}</span>
    </div>
  );
}

function CandidateDetail() {
  const { id } = useParams({ from: "/admin/candidates/$id" });
  // Prefer live candidate from store (includes submitted onboarding records); fall back to mock seed.
  const live = useDB((d) => d.candidates.find((x) => x.id === id));
  const mock = mockCandidates.find((x) => x.id === id) ?? mockCandidates[0];
  const c = live ?? mock;
  const status = live?.status ?? mock.status;
  const [remarks, setRemarks] = useState<string>(live?.remarks ?? mock.remarks ?? "");

  const approve = () => {
    if (!live) return toast.info("Demo candidate — actions apply to live applications.");
    const next = status === "HR Manager Approved" ? "HoD Approved" : status === "HoD Approved" ? "Offer Released" : "HR Manager Approved";
    updateCandidateStatus(live.id, next, "HR Admin", remarks || undefined);
    toast.success(`Status updated to ${next}`);
  };
  const reject = () => {
    if (!live) return toast.info("Demo candidate — actions apply to live applications.");
    if (!remarks.trim()) return toast.error("Please add remarks before rejecting.");
    updateCandidateStatus(live.id, "Rejected", "HR Admin", remarks);
    toast.success("Application rejected");
  };
  const correction = () => {
    if (!live) return toast.info("Demo candidate — actions apply to live applications.");
    if (!remarks.trim()) return toast.error("Please describe what needs correcting.");
    requestCorrection(live.id, "HR Admin", remarks);
    toast.success("Correction requested");
  };

  return (
    <RoleLayout items={adminNav} role="Admin" user="Admin User">
      <Button asChild variant="ghost" size="sm" className="mb-3">
        <Link to="/admin/candidates"><ArrowLeft className="h-4 w-4 mr-1" />Back to Candidates</Link>
      </Button>
      <PageHeader
        title={c.name}
        description={`${c.id} • ${("submittedAt" in c && c.submittedAt) ? `Submitted ${new Date(c.submittedAt).toLocaleDateString()}` : ("submissionDate" in c ? `Submitted ${(c as { submissionDate: string }).submissionDate}` : "")}`}
        action={<StatusBadge status={status} />}
      />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
            <CardContent>
              <Row label="Full Name" value={c.name} />
              <Row label="Email" value={c.email} />
              <Row label="Mobile" value={c.mobile} />
              <Row label="DOB" value={c.dob} />
              <Row label="Address" value={("address" in c ? c.address : ("city" in c ? (c as { city: string }).city : "—"))} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Education Information</CardTitle></CardHeader>
            <CardContent>
              <Row label="Degree" value={c.degree} />
              <Row label="College" value={"college" in c ? c.college : "—"} />
              <Row label="Year" value={"year" in c ? c.year : "—"} />
              <Row label="Percentage" value={"percentage" in c ? c.percentage : "—"} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Employment Information</CardTitle></CardHeader>
            <CardContent>
              <Row label="Previous Company" value={"previousCompany" in c ? c.previousCompany : "—"} />
              <Row label="Designation" value={c.designation} />
              <Row label="Experience" value={c.experience} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Uploaded Documents</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockDocuments.slice(0, 6).map((d) => (
                  <DocumentCard key={d.name} {...d} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Status Update</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">Current</div>
              <StatusBadge status={status} />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button onClick={approve} className="bg-emerald-600 hover:bg-emerald-700"><Check className="h-4 w-4 mr-1" />Advance</Button>
                <Button onClick={reject} variant="destructive"><X className="h-4 w-4 mr-1" />Reject</Button>
              </div>
              <Button onClick={correction} variant="outline" className="w-full">
                <FileEdit className="h-4 w-4 mr-1" />Request Correction
              </Button>
              <p className="text-xs text-muted-foreground">Approve advances Submitted → Under Review → HR Approved → HoD Approved → Offer Released.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Remarks</CardTitle></CardHeader>
            <CardContent>
              <Textarea rows={5} placeholder="Add remarks for the candidate..." value={remarks} onChange={(e) => setRemarks(e.target.value)} />
              <p className="text-xs text-muted-foreground mt-2">Remarks are attached to Approve / Reject / Request Correction actions and shown to the candidate.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleLayout>
  );
}
