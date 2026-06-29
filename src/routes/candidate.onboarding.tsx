import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoleLayout } from "@/components/hrms/RoleLayout";
import { candidateNav } from "@/components/hrms/navConfigs";
import { Stepper, MobileStepProgress, type Step } from "@/components/hrms/Stepper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "@/components/hrms/FileUpload";
import { StatusBadge } from "@/components/hrms/StatusBadge";
import { Plus, Trash2, ChevronLeft, ChevronRight, Send, Save, ShieldCheck, FileCheck2 } from "lucide-react";
import { toast } from "sonner";
import { saveDraft, submitOnboarding, uid, nowISO, useDB } from "@/data/store";
import type { OnboardingSubmission, Education, Certification, Skill, EmploymentHistory, Reference, FamilyMember, DocumentRecord } from "@/data/types";

export const Route = createFileRoute("/candidate/onboarding")({ component: OnboardingPage });

// --- helpers ---
type Form = Partial<OnboardingSubmission>;

const steps: Step[] = [
  { id: 1, title: "Personal Details" },
  { id: 2, title: "Banking" },
  { id: 3, title: "Identity" },
  { id: 4, title: "Visa" },
  { id: 5, title: "Education" },
  { id: 6, title: "Certifications" },
  { id: 7, title: "Skills & Experience" },
  { id: 8, title: "Employment History" },
  { id: 9, title: "Professional Info" },
  { id: 10, title: "References" },
  { id: 11, title: "Family" },
  { id: 12, title: "Emergency Contact" },
  { id: 13, title: "Salary" },
  { id: 14, title: "Documents" },
  { id: 15, title: "Review & Submit" },
];

const requiredDocs: { key: keyof DocsState; label: string }[] = [
  { key: "pan", label: "PAN Copy" },
  { key: "aadhaar", label: "Aadhaar Copy" },
  { key: "photo", label: "Passport Size Photograph" },
  { key: "cheque", label: "Cancelled Cheque" },
  { key: "education", label: "Educational Certificates" },
  { key: "address", label: "Address Proof" },
];

const optionalDocs: { key: keyof DocsState; label: string }[] = [
  { key: "passport", label: "Passport" },
  { key: "sap", label: "SAP Certification" },
  { key: "offer", label: "Offer Letter" },
  { key: "relieving", label: "Relieving Letter" },
  { key: "slips", label: "Salary Slips (Last 3 months)" },
  { key: "bankStatement", label: "Salary Bank Statement" },
];

type FileMeta = { name: string; size: number; type: string; dataUrl?: string } | null;
type DocsState = {
  pan: FileMeta; aadhaar: FileMeta; photo: FileMeta; cheque: FileMeta;
  education: FileMeta; address: FileMeta; passport: FileMeta; sap: FileMeta;
  offer: FileMeta; relieving: FileMeta; slips: FileMeta; bankStatement: FileMeta;
};

const initialDocs: DocsState = {
  pan: null, aadhaar: null, photo: null, cheque: null, education: null, address: null,
  passport: null, sap: null, offer: null, relieving: null, slips: null, bankStatement: null,
};

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}{required && <span className="text-destructive ml-0.5">*</span>}</Label>
      {children}
    </div>
  );
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
  );
}

// --- main ---
function OnboardingPage() {
  const navigate = useNavigate();
  const draft = useDB((d) => d.draft);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(() => draft ?? {
    education: [], certifications: [], skills: [], employment: [], references: [], family: [],
  });
  const [docs, setDocs] = useState<DocsState>(initialDocs);
  const [declaration, setDeclaration] = useState(false);

  const update = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSaveDraft = () => {
    saveDraft({ ...form, updatedAt: nowISO() });
    toast.success("Draft saved");
  };

  const missingDocs = requiredDocs.filter((d) => !docs[d.key]);
  const canSubmit = declaration && missingDocs.length === 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const documents: DocumentRecord[] = (Object.keys(docs) as (keyof DocsState)[])
      .filter((k) => docs[k])
      .map((k) => {
        const f = docs[k]!;
        const labelMap = [...requiredDocs, ...optionalDocs].find((d) => d.key === k);
        return {
          id: uid("DOC"),
          category: "Other", label: labelMap?.label ?? String(k),
          fileName: f.name, fileSize: f.size, fileType: f.type,
          uploadedAt: nowISO(), required: !!requiredDocs.find((d) => d.key === k),
          dataUrl: f.dataUrl,
        };
      });

    const submission: OnboardingSubmission = {
      id: uid("SUB"),
      candidateId: uid("CAN"),
      personal: form.personal ?? {},
      bank: form.bank ?? {},
      identity: form.identity ?? {},
      visa: form.visa ?? {},
      education: form.education ?? [],
      certifications: form.certifications ?? [],
      skills: form.skills ?? [],
      totalExperience: form.totalExperience,
      employment: form.employment ?? [],
      professional: form.professional ?? {},
      references: form.references ?? [],
      family: form.family ?? [],
      emergency: form.emergency ?? {},
      salary: form.salary,
      documents,
      declarationAccepted: true,
      status: "Submitted",
      history: [{ id: uid("H"), status: "Submitted", at: nowISO(), by: "Candidate" }],
      createdAt: nowISO(), updatedAt: nowISO(), submittedAt: nowISO(),
    };
    submitOnboarding(submission);
    toast.success("Onboarding submitted!", { description: "HR will review your submission shortly." });
    setTimeout(() => navigate({ to: "/candidate/status" }), 800);
  };

  return (
    <RoleLayout
  items={candidateNav}
  role="Candidate"
  user={
    form.personal?.firstName
      ? `${form.personal.firstName} ${form.personal.lastName ?? ""}`.trim()
      : "New Candidate"
  }
>
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Onboarding</h1>
            <p className="text-sm text-muted-foreground">Complete the {steps.length}-step process to start your journey.</p>
          </div>
          <Button variant="outline" onClick={handleSaveDraft}><Save className="h-4 w-4 mr-2" />Save Draft</Button>
        </div>
      </div>

      <MobileStepProgress current={step} total={steps.length} title={steps[step].title} />

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className="hidden lg:block">
          <Card className="sticky top-20">
            <CardContent className="p-3">
              <Stepper steps={steps} current={step} onJump={setStep} />
            </CardContent>
          </Card>
        </aside>

        <div className="min-w-0">
          <Card>
            <CardContent className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.18 }}
                >
                  {step === 0 && <StepPersonal form={form} update={update} />}
                  {step === 1 && <StepBank form={form} update={update} docs={docs} setDocs={setDocs} />}
                  {step === 2 && <StepIdentity form={form} update={update} docs={docs} setDocs={setDocs} />}
                  {step === 3 && <StepVisa form={form} update={update} />}
                  {step === 4 && <StepEducation form={form} update={update} docs={docs} setDocs={setDocs} />}
                  {step === 5 && <StepCertifications form={form} update={update} />}
                  {step === 6 && <StepSkills form={form} update={update} />}
                  {step === 7 && <StepEmployment form={form} update={update} />}
                  {step === 8 && <StepProfessional form={form} update={update} />}
                  {step === 9 && <StepReferences form={form} update={update} />}
                  {step === 10 && <StepFamily form={form} update={update} />}
                  {step === 11 && <StepEmergency form={form} update={update} />}
                  {step === 12 && <StepSalary form={form} update={update} />}
                  {step === 13 && <StepDocuments docs={docs} setDocs={setDocs} />}
                  {step === 14 && (
                    <StepReview
                      form={form} docs={docs} missingDocs={missingDocs}
                      declaration={declaration} setDeclaration={setDeclaration}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              <Separator className="my-8" />
              <div className="flex items-center justify-between gap-3">
                <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
                  <ChevronLeft className="h-4 w-4 mr-1" />Back
                </Button>
                <div className="text-xs text-muted-foreground hidden sm:block">Step {step + 1} of {steps.length}</div>
                {step < steps.length - 1 ? (
                  <Button onClick={() => setStep((s) => s + 1)}>
                    Next<ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!canSubmit}>
                    <Send className="h-4 w-4 mr-2" />Submit Onboarding
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleLayout>
  );
}

// ============ STEP COMPONENTS ============

function StepPersonal({ form, update }: { form: Form; update: <K extends keyof Form>(k: K, v: Form[K]) => void }) {
  const p = form.personal ?? {};
  const setP = (patch: Partial<typeof p>) => update("personal", { ...p, ...patch });
  const setPresent = (patch: Partial<NonNullable<typeof p.presentAddress>>) =>
    setP({ presentAddress: { ...(p.presentAddress ?? { line1: "", city: "", state: "", pincode: "" }), ...patch } });
  const setPerm = (patch: Partial<NonNullable<typeof p.permanentAddress>>) =>
    setP({ permanentAddress: { ...(p.permanentAddress ?? { line1: "", city: "", state: "", pincode: "" }), ...patch } });

  return (
    <div>
      <SectionTitle title="Personal Details" description="Tell us about yourself." />
      <div className="grid md:grid-cols-6 gap-4">
        <Field label="Title" required>
          <Select value={p.title} onValueChange={(v) => setP({ title: v as typeof p.title })}>
            <SelectTrigger><SelectValue placeholder="Title" /></SelectTrigger>
            <SelectContent>
              {(["Mr", "Mrs", "Ms", "Dr"] as const).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <div className="md:col-span-2"><Field label="First Name" required><Input value={p.firstName ?? ""} onChange={(e) => setP({ firstName: e.target.value })} /></Field></div>
        <div className="md:col-span-1"><Field label="Middle Name"><Input value={p.middleName ?? ""} onChange={(e) => setP({ middleName: e.target.value })} /></Field></div>
        <div className="md:col-span-2"><Field label="Last Name" required><Input value={p.lastName ?? ""} onChange={(e) => setP({ lastName: e.target.value })} /></Field></div>

        <div className="md:col-span-2"><Field label="Date of Birth" required><Input type="date" value={p.dob ?? ""} onChange={(e) => setP({ dob: e.target.value })} /></Field></div>
        <div className="md:col-span-2"><Field label="Mobile" required><Input value={p.mobile ?? ""} onChange={(e) => setP({ mobile: e.target.value })} placeholder="+91 ..." /></Field></div>
        <div className="md:col-span-2"><Field label="Email" required><Input type="email" value={p.email ?? ""} onChange={(e) => setP({ email: e.target.value })} /></Field></div>
        <div className="md:col-span-3"><Field label="Mother Tongue"><Input value={p.motherTongue ?? ""} onChange={(e) => setP({ motherTongue: e.target.value })} /></Field></div>
      </div>

      <Separator className="my-6" />
      <h3 className="font-medium mb-3">Present Address</h3>
      <div className="grid md:grid-cols-6 gap-4">
        <div className="md:col-span-6"><Field label="Address" required><Textarea value={p.presentAddress?.line1 ?? ""} onChange={(e) => setPresent({ line1: e.target.value })} /></Field></div>
        <div className="md:col-span-2"><Field label="City" required><Input value={p.presentAddress?.city ?? ""} onChange={(e) => setPresent({ city: e.target.value })} /></Field></div>
        <div className="md:col-span-2"><Field label="State" required><Input value={p.presentAddress?.state ?? ""} onChange={(e) => setPresent({ state: e.target.value })} /></Field></div>
        <div className="md:col-span-1"><Field label="Pincode" required><Input value={p.presentAddress?.pincode ?? ""} onChange={(e) => setPresent({ pincode: e.target.value })} /></Field></div>
        <div className="md:col-span-1"><Field label="Home Tel."><Input value={p.presentAddress?.homeTelephone ?? ""} onChange={(e) => setPresent({ homeTelephone: e.target.value })} /></Field></div>
      </div>

      <Separator className="my-6" />
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Permanent Address</h3>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={p.sameAsPresent ?? false} onCheckedChange={(v) => {
            setP({ sameAsPresent: !!v, permanentAddress: v ? p.presentAddress : p.permanentAddress });
          }} />
          Same as present
        </label>
      </div>
      <div className="grid md:grid-cols-6 gap-4">
        <div className="md:col-span-6"><Field label="Address"><Textarea disabled={p.sameAsPresent} value={p.permanentAddress?.line1 ?? ""} onChange={(e) => setPerm({ line1: e.target.value })} /></Field></div>
        <div className="md:col-span-2"><Field label="City"><Input disabled={p.sameAsPresent} value={p.permanentAddress?.city ?? ""} onChange={(e) => setPerm({ city: e.target.value })} /></Field></div>
        <div className="md:col-span-2"><Field label="State"><Input disabled={p.sameAsPresent} value={p.permanentAddress?.state ?? ""} onChange={(e) => setPerm({ state: e.target.value })} /></Field></div>
        <div className="md:col-span-1"><Field label="Pincode"><Input disabled={p.sameAsPresent} value={p.permanentAddress?.pincode ?? ""} onChange={(e) => setPerm({ pincode: e.target.value })} /></Field></div>
        <div className="md:col-span-1"><Field label="Home Tel."><Input disabled={p.sameAsPresent} value={p.permanentAddress?.homeTelephone ?? ""} onChange={(e) => setPerm({ homeTelephone: e.target.value })} /></Field></div>
      </div>
    </div>
  );
}

function StepBank({ form, update, docs, setDocs }: { form: Form; update: <K extends keyof Form>(k: K, v: Form[K]) => void; docs: DocsState; setDocs: (d: DocsState) => void }) {
  const b = form.bank ?? {};
  const setB = (patch: Partial<typeof b>) => update("bank", { ...b, ...patch });
  return (
    <div>
      <SectionTitle title="Banking Details" description="Where you'd like your salary deposited." />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Bank Name" required><Input value={b.bankName ?? ""} onChange={(e) => setB({ bankName: e.target.value })} /></Field>
        <Field label="Branch" required><Input value={b.branch ?? ""} onChange={(e) => setB({ branch: e.target.value })} /></Field>
        <Field label="IFSC Code" required><Input value={b.ifsc ?? ""} onChange={(e) => setB({ ifsc: e.target.value.toUpperCase() })} placeholder="ABCD0123456" /></Field>
        <Field label="Account Number" required><Input value={b.accountNumber ?? ""} onChange={(e) => setB({ accountNumber: e.target.value })} /></Field>
      </div>
      <Separator className="my-6" />
      <FileUpload label="Cancelled Cheque" required value={docs.cheque} onChange={(f) => setDocs({ ...docs, cheque: f })} />
    </div>
  );
}

function StepIdentity({ form, update, docs, setDocs }: { form: Form; update: <K extends keyof Form>(k: K, v: Form[K]) => void; docs: DocsState; setDocs: (d: DocsState) => void }) {
  const id = form.identity ?? {};
  const setI = (patch: Partial<typeof id>) => update("identity", { ...id, ...patch });
  const panValid = !id.pan || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(id.pan ?? "");
  const aadhaarValid = !id.aadhaar || /^\d{12}$/.test((id.aadhaar ?? "").replace(/\s/g, ""));
  return (
    <div>
      <SectionTitle title="Identity Information" description="Government-issued identification." />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="PAN Number" required>
          <Input value={id.pan ?? ""} onChange={(e) => setI({ pan: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" />
          {!panValid && <p className="text-xs text-destructive mt-1">PAN format: 5 letters, 4 digits, 1 letter</p>}
        </Field>
        <Field label="Aadhaar Number" required>
          <Input value={id.aadhaar ?? ""} onChange={(e) => setI({ aadhaar: e.target.value })} placeholder="1234 5678 9012" />
          {!aadhaarValid && <p className="text-xs text-destructive mt-1">Aadhaar must be 12 digits</p>}
        </Field>
        <Field label="Driving License"><Input value={id.drivingLicense ?? ""} onChange={(e) => setI({ drivingLicense: e.target.value })} /></Field>
        <Field label="Citizenship" required><Input value={id.citizenship ?? "Indian"} onChange={(e) => setI({ citizenship: e.target.value })} /></Field>
        <Field label="Passport Number"><Input value={id.passport ?? ""} onChange={(e) => setI({ passport: e.target.value })} /></Field>
        <Field label="Passport Expiry"><Input type="date" value={id.passportExpiry ?? ""} onChange={(e) => setI({ passportExpiry: e.target.value })} /></Field>
        <Field label="Place of Issue"><Input value={id.placeOfIssue ?? ""} onChange={(e) => setI({ placeOfIssue: e.target.value })} /></Field>
      </div>
      <Separator className="my-6" />
      <div className="grid md:grid-cols-3 gap-4">
        <FileUpload label="PAN Copy" required value={docs.pan} onChange={(f) => setDocs({ ...docs, pan: f })} />
        <FileUpload label="Aadhaar Copy" required value={docs.aadhaar} onChange={(f) => setDocs({ ...docs, aadhaar: f })} />
        <FileUpload label="Passport Copy" value={docs.passport} onChange={(f) => setDocs({ ...docs, passport: f })} />
      </div>
    </div>
  );
}

function StepVisa({ form, update }: { form: Form; update: <K extends keyof Form>(k: K, v: Form[K]) => void }) {
  const v = form.visa ?? {};
  const setV = (patch: Partial<typeof v>) => update("visa", { ...v, ...patch });
  return (
    <div>
      <SectionTitle title="Visa Information" description="Work permit and visa history." />
      <div className="space-y-5">
        <div>
          <Label className="text-sm">Have you applied for a Work Permit / Visa? <span className="text-destructive">*</span></Label>
          <RadioGroup value={v.appliedForVisa ?? ""} onValueChange={(val) => setV({ appliedForVisa: val as "Yes" | "No" })} className="mt-2 flex gap-6">
            <label className="flex items-center gap-2"><RadioGroupItem value="Yes" />Yes</label>
            <label className="flex items-center gap-2"><RadioGroupItem value="No" />No</label>
          </RadioGroup>
        </div>
        <div>
          <Label className="text-sm">Has a Work Permit / Visa ever been rejected? <span className="text-destructive">*</span></Label>
          <RadioGroup value={v.visaRejected ?? ""} onValueChange={(val) => setV({ visaRejected: val as "Yes" | "No" })} className="mt-2 flex gap-6">
            <label className="flex items-center gap-2"><RadioGroupItem value="Yes" />Yes</label>
            <label className="flex items-center gap-2"><RadioGroupItem value="No" />No</label>
          </RadioGroup>
        </div>
        {v.visaRejected === "Yes" && (
          <div className="grid md:grid-cols-3 gap-4 p-4 rounded-lg bg-muted/40 border">
            <Field label="Country"><Input value={v.rejectionCountry ?? ""} onChange={(e) => setV({ rejectionCountry: e.target.value })} /></Field>
            <Field label="Date"><Input type="date" value={v.rejectionDate ?? ""} onChange={(e) => setV({ rejectionDate: e.target.value })} /></Field>
            <Field label="Reason"><Input value={v.rejectionReason ?? ""} onChange={(e) => setV({ rejectionReason: e.target.value })} /></Field>
          </div>
        )}
      </div>
    </div>
  );
}

const eduCategories = ["Professional/Post Graduation", "Bachelor's Degree", "12th", "10th", "Others"];

function StepEducation({ form, update, docs, setDocs }: { form: Form; update: <K extends keyof Form>(k: K, v: Form[K]) => void; docs: DocsState; setDocs: (d: DocsState) => void }) {
  const list = form.education ?? [];
  const add = () => update("education", [...list, { id: uid("EDU"), category: eduCategories[0], qualification: "", university: "", yearFrom: "", yearTo: "", percentage: "" }]);
  const set = (i: number, patch: Partial<Education>) => update("education", list.map((e, idx) => idx === i ? { ...e, ...patch } : e));
  const remove = (i: number) => update("education", list.filter((_, idx) => idx !== i));

  return (
    <div>
      <SectionTitle title="Educational Details" description="Add each qualification you have completed." />
      <div className="space-y-4">
        {list.length === 0 && <p className="text-sm text-muted-foreground">No qualifications added yet.</p>}
        {list.map((e, i) => (
          <div key={e.id} className="rounded-lg border p-4 bg-card relative">
            <button onClick={() => remove(i)} aria-label="Remove" className="absolute top-3 right-3 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Category">
                <Select value={e.category} onValueChange={(v) => set(i, { category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{eduCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Qualification" required><Input value={e.qualification} onChange={(ev) => set(i, { qualification: ev.target.value })} /></Field>
              <Field label="University / Board" required><Input value={e.university} onChange={(ev) => set(i, { university: ev.target.value })} /></Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="From"><Input value={e.yearFrom} onChange={(ev) => set(i, { yearFrom: ev.target.value })} placeholder="2018" /></Field>
                <Field label="To"><Input value={e.yearTo} onChange={(ev) => set(i, { yearTo: ev.target.value })} placeholder="2022" /></Field>
                <Field label="% / GPA"><Input value={e.percentage} onChange={(ev) => set(i, { percentage: ev.target.value })} /></Field>
              </div>
              <div className="md:col-span-2"><Field label="Scholastic Achievements"><Textarea value={e.achievements ?? ""} onChange={(ev) => set(i, { achievements: ev.target.value })} /></Field></div>
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={add}><Plus className="h-4 w-4 mr-1" />Add Qualification</Button>
      </div>
      <Separator className="my-6" />
      <FileUpload label="Consolidated Educational Certificates" required value={docs.education} onChange={(f) => setDocs({ ...docs, education: f })} hint="Combine all marksheets and degrees into a single PDF." />
    </div>
  );
}

function StepCertifications({ form, update }: { form: Form; update: <K extends keyof Form>(k: K, v: Form[K]) => void }) {
  const list = form.certifications ?? [];
  const add = () => update("certifications", [...list, { id: uid("CRT"), name: "", year: "" }]);
  const set = (i: number, patch: Partial<Certification>) => update("certifications", list.map((c, idx) => idx === i ? { ...c, ...patch } : c));
  const remove = (i: number) => update("certifications", list.filter((_, idx) => idx !== i));
  return (
    <div>
      <SectionTitle title="Certifications" description="Professional certifications, including SAP." />
      <div className="space-y-3">
        {list.length === 0 && <p className="text-sm text-muted-foreground">No certifications added.</p>}
        {list.map((c, i) => (
          <div key={c.id} className="grid md:grid-cols-[1fr_140px_auto] gap-3 items-end rounded-lg border p-4 bg-card">
            <Field label="Certification Name"><Input value={c.name} onChange={(e) => set(i, { name: e.target.value })} /></Field>
            <Field label="Year"><Input value={c.year} onChange={(e) => set(i, { year: e.target.value })} /></Field>
            <Button variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Remove"><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button variant="outline" onClick={add}><Plus className="h-4 w-4 mr-1" />Add Certification</Button>
      </div>
    </div>
  );
}

function StepSkills({ form, update }: { form: Form; update: <K extends keyof Form>(k: K, v: Form[K]) => void }) {
  const list = form.skills ?? [];
  const add = (type: Skill["type"]) => update("skills", [...list, { id: uid("SK"), type, name: "", experience: "" }]);
  const set = (i: number, patch: Partial<Skill>) => update("skills", list.map((s, idx) => idx === i ? { ...s, ...patch } : s));
  const remove = (i: number) => update("skills", list.filter((_, idx) => idx !== i));
  const tech = list.filter((s) => s.type === "Technical");
  const func = list.filter((s) => s.type === "Functional");

  return (
    <div>
      <SectionTitle title="Skills & Experience" />
      <Field label="Total Experience" required>
        <Input value={form.totalExperience ?? ""} onChange={(e) => update("totalExperience", e.target.value)} placeholder="e.g. 4.5 years" />
      </Field>
      <Separator className="my-6" />
      {(["Technical", "Functional"] as const).map((type) => (
        <div key={type} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{type} Expertise</h3>
            <Button variant="outline" size="sm" onClick={() => add(type)}><Plus className="h-4 w-4 mr-1" />Add</Button>
          </div>
          <div className="space-y-2">
            {(type === "Technical" ? tech : func).length === 0 && <p className="text-sm text-muted-foreground">No entries.</p>}
            {list.map((s, i) => s.type === type && (
              <div key={s.id} className="grid md:grid-cols-[1fr_160px_auto] gap-3 items-end">
                <Field label={type === "Technical" ? "Skill" : "Domain"}><Input value={s.name} onChange={(e) => set(i, { name: e.target.value })} /></Field>
                <Field label="Experience"><Input value={s.experience} onChange={(e) => set(i, { experience: e.target.value })} placeholder="e.g. 2 years" /></Field>
                <Button variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Remove"><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StepEmployment({ form, update }: { form: Form; update: <K extends keyof Form>(k: K, v: Form[K]) => void }) {
  const list = form.employment ?? [];
  const add = () => update("employment", [...list, { id: uid("EMP"), organization: "", designation: "", fromDate: "", toDate: "", responsibilities: "" }]);
  const set = (i: number, patch: Partial<EmploymentHistory>) => update("employment", list.map((e, idx) => idx === i ? { ...e, ...patch } : e));
  const remove = (i: number) => update("employment", list.filter((_, idx) => idx !== i));

  return (
    <div>
      <SectionTitle title="Employment History" description="Most recent first." />
      <div className="space-y-4">
        {list.length === 0 && <p className="text-sm text-muted-foreground">No previous employment added.</p>}
        {list.map((e, i) => (
          <div key={e.id} className="rounded-lg border p-4 bg-card relative">
            <button onClick={() => remove(i)} aria-label="Remove" className="absolute top-3 right-3 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Organization" required><Input value={e.organization} onChange={(ev) => set(i, { organization: ev.target.value })} /></Field>
              <Field label="Designation" required><Input value={e.designation} onChange={(ev) => set(i, { designation: ev.target.value })} /></Field>
              <Field label="From"><Input type="date" value={e.fromDate} onChange={(ev) => set(i, { fromDate: ev.target.value })} /></Field>
              <Field label="To"><Input type="date" value={e.toDate} onChange={(ev) => set(i, { toDate: ev.target.value })} /></Field>
              <div className="md:col-span-2"><Field label="Responsibilities"><Textarea rows={3} value={e.responsibilities} onChange={(ev) => set(i, { responsibilities: ev.target.value })} /></Field></div>
              <Field label="Team Size"><Input value={e.teamSize ?? ""} onChange={(ev) => set(i, { teamSize: ev.target.value })} /></Field>
              <Field label="Managerial Role">
                <Select value={e.managerial ?? ""} onValueChange={(v) => set(i, { managerial: v as "Yes" | "No" })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                </Select>
              </Field>
              <Field label="Compensation"><Input value={e.compensation ?? ""} onChange={(ev) => set(i, { compensation: ev.target.value })} placeholder="₹ Annual" /></Field>
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={add}><Plus className="h-4 w-4 mr-1" />Add Employment</Button>
      </div>
      <p className="text-xs text-muted-foreground mt-4">Document uploads (offer letters, relieving letters, payslips, bank statements) can be added in the Documents step.</p>
    </div>
  );
}

function StepProfessional({ form, update }: { form: Form; update: <K extends keyof Form>(k: K, v: Form[K]) => void }) {
  const p = form.professional ?? {};
  const setP = (patch: Partial<typeof p>) => update("professional", { ...p, ...patch });
  return (
    <div>
      <SectionTitle title="Professional Information" />
      <div className="space-y-4">
        <Field label="Professional Achievements"><Textarea value={p.achievements ?? ""} onChange={(e) => setP({ achievements: e.target.value })} /></Field>
        <Field label="Awards & Recognition"><Textarea value={p.awards ?? ""} onChange={(e) => setP({ awards: e.target.value })} /></Field>
        <Field label="Extra Curricular Activities"><Textarea value={p.extraCurricular ?? ""} onChange={(e) => setP({ extraCurricular: e.target.value })} /></Field>
        <div>
          <Label className="text-sm">Friends or Relatives in the Company? <span className="text-destructive">*</span></Label>
          <RadioGroup value={p.relativesInCompany ?? ""} onValueChange={(v) => setP({ relativesInCompany: v as "Yes" | "No" })} className="mt-2 flex gap-6">
            <label className="flex items-center gap-2"><RadioGroupItem value="Yes" />Yes</label>
            <label className="flex items-center gap-2"><RadioGroupItem value="No" />No</label>
          </RadioGroup>
        </div>
        {p.relativesInCompany === "Yes" && (
          <div className="grid md:grid-cols-3 gap-4 p-4 rounded-lg bg-muted/40 border">
            <Field label="Name"><Input value={p.relativeName ?? ""} onChange={(e) => setP({ relativeName: e.target.value })} /></Field>
            <Field label="Relationship"><Input value={p.relativeRelation ?? ""} onChange={(e) => setP({ relativeRelation: e.target.value })} /></Field>
            <Field label="Years Known"><Input value={p.relativeYearsKnown ?? ""} onChange={(e) => setP({ relativeYearsKnown: e.target.value })} /></Field>
          </div>
        )}
      </div>
    </div>
  );
}

function StepReferences({ form, update }: { form: Form; update: <K extends keyof Form>(k: K, v: Form[K]) => void }) {
  const list = form.references ?? [];
  const add = () => list.length < 3 && update("references", [...list, { id: uid("REF"), name: "", relationship: "", yearsKnown: "", company: "", occupation: "" }]);
  const set = (i: number, patch: Partial<Reference>) => update("references", list.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  const remove = (i: number) => update("references", list.filter((_, idx) => idx !== i));
  return (
    <div>
      <SectionTitle title="References" description="Up to 3 professional references." />
      <div className="space-y-4">
        {list.map((r, i) => (
          <div key={r.id} className="rounded-lg border p-4 bg-card relative">
            <button onClick={() => remove(i)} aria-label="Remove" className="absolute top-3 right-3 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Name" required><Input value={r.name} onChange={(e) => set(i, { name: e.target.value })} /></Field>
              <Field label="Relationship"><Input value={r.relationship} onChange={(e) => set(i, { relationship: e.target.value })} /></Field>
              <Field label="Years Known"><Input value={r.yearsKnown} onChange={(e) => set(i, { yearsKnown: e.target.value })} /></Field>
              <Field label="Company"><Input value={r.company} onChange={(e) => set(i, { company: e.target.value })} /></Field>
              <Field label="Occupation"><Input value={r.occupation} onChange={(e) => set(i, { occupation: e.target.value })} /></Field>
              <Field label="Home Phone"><Input value={r.homePhone ?? ""} onChange={(e) => set(i, { homePhone: e.target.value })} /></Field>
              <Field label="Business Phone"><Input value={r.businessPhone ?? ""} onChange={(e) => set(i, { businessPhone: e.target.value })} /></Field>
            </div>
          </div>
        ))}
        {list.length < 3 && <Button variant="outline" onClick={add}><Plus className="h-4 w-4 mr-1" />Add Reference</Button>}
      </div>
    </div>
  );
}

function StepFamily({ form, update }: { form: Form; update: <K extends keyof Form>(k: K, v: Form[K]) => void }) {
  const list = form.family ?? [];
  const ensure = (relation: FamilyMember["relation"]) => list.find((f) => f.relation === relation);
  const upsert = (relation: FamilyMember["relation"], patch: Partial<FamilyMember>) => {
    const existing = ensure(relation);
    if (existing) update("family", list.map((f) => f.id === existing.id ? { ...f, ...patch } : f));
    else update("family", [...list, { id: uid("FAM"), relation, name: "", dob: "", occupation: "", ...patch }]);
  };
  const children = list.filter((f) => f.relation === "Child");
  const addChild = () => children.length < 3 && update("family", [...list, { id: uid("FAM"), relation: "Child", name: "", dob: "", occupation: "" }]);
  const updateChild = (id: string, patch: Partial<FamilyMember>) => update("family", list.map((f) => f.id === id ? { ...f, ...patch } : f));
  const removeChild = (id: string) => update("family", list.filter((f) => f.id !== id));

  const Block = ({ relation }: { relation: "Father" | "Mother" | "Spouse" }) => {
    const m = ensure(relation);
    return (
      <div className="rounded-lg border p-4 bg-card">
        <h3 className="font-medium mb-3">{relation}</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Name"><Input value={m?.name ?? ""} onChange={(e) => upsert(relation, { name: e.target.value })} /></Field>
          <Field label="DOB"><Input type="date" value={m?.dob ?? ""} onChange={(e) => upsert(relation, { dob: e.target.value })} /></Field>
          <Field label="Occupation"><Input value={m?.occupation ?? ""} onChange={(e) => upsert(relation, { occupation: e.target.value })} /></Field>
        </div>
      </div>
    );
  };

  return (
    <div>
      <SectionTitle title="Family Information" />
      <div className="space-y-4">
        <Block relation="Father" />
        <Block relation="Mother" />
        <Block relation="Spouse" />
        <div className="rounded-lg border p-4 bg-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Children</h3>
            {children.length < 3 && <Button variant="outline" size="sm" onClick={addChild}><Plus className="h-4 w-4 mr-1" />Add Child</Button>}
          </div>
          {children.length === 0 && <p className="text-sm text-muted-foreground">No children added.</p>}
          <div className="space-y-3">
            {children.map((c) => (
              <div key={c.id} className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
                <Field label="Name"><Input value={c.name} onChange={(e) => updateChild(c.id, { name: e.target.value })} /></Field>
                <Field label="DOB"><Input type="date" value={c.dob} onChange={(e) => updateChild(c.id, { dob: e.target.value })} /></Field>
                <Field label="Occupation"><Input value={c.occupation} onChange={(e) => updateChild(c.id, { occupation: e.target.value })} /></Field>
                <Button variant="ghost" size="icon" onClick={() => removeChild(c.id)} aria-label="Remove"><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepEmergency({ form, update }: { form: Form; update: <K extends keyof Form>(k: K, v: Form[K]) => void }) {
  const e = form.emergency ?? {};
  const setE = (patch: Partial<typeof e>) => update("emergency", { ...e, ...patch });
  return (
    <div>
      <SectionTitle title="Emergency Contact" />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Name" required><Input value={e.name ?? ""} onChange={(ev) => setE({ name: ev.target.value })} /></Field>
        <Field label="Relationship" required><Input value={e.relationship ?? ""} onChange={(ev) => setE({ relationship: ev.target.value })} /></Field>
        <div className="md:col-span-2"><Field label="Address"><Textarea value={e.address ?? ""} onChange={(ev) => setE({ address: ev.target.value })} /></Field></div>
        <Field label="City"><Input value={e.city ?? ""} onChange={(ev) => setE({ city: ev.target.value })} /></Field>
        <Field label="State"><Input value={e.state ?? ""} onChange={(ev) => setE({ state: ev.target.value })} /></Field>
        <Field label="Pincode"><Input value={e.pincode ?? ""} onChange={(ev) => setE({ pincode: ev.target.value })} /></Field>
        <Field label="Mobile" required><Input value={e.mobile ?? ""} onChange={(ev) => setE({ mobile: ev.target.value })} /></Field>
        <Field label="Telephone"><Input value={e.telephone ?? ""} onChange={(ev) => setE({ telephone: ev.target.value })} /></Field>
      </div>
    </div>
  );
}

function StepSalary({ form, update }: { form: Form; update: <K extends keyof Form>(k: K, v: Form[K]) => void }) {
  const s = form.salary ?? {
    monthly: { basic: 0, hra: 0, conveyance: 0, utilityAllowance: 0, adhocAllowance: 0, skillAllowance: 0 },
    annual: { medical: 0, lta: 0, pf: 0, gratuity: 0, bonus: 0, foodFacility: 0, mediclaim: 0, superannuation: 0 },
  };
  const monthlyGross = Object.values(s.monthly).reduce((a, b) => a + Number(b || 0), 0);
  const annualGross = monthlyGross * 12 + Object.values(s.annual).reduce((a, b) => a + Number(b || 0), 0);
  const setM = (k: keyof typeof s.monthly, v: number) => update("salary", { ...s, monthly: { ...s.monthly, [k]: v } });
  const setA = (k: keyof typeof s.annual, v: number) => update("salary", { ...s, annual: { ...s.annual, [k]: v } });
  const num = (v: string) => Number(v.replace(/[^\d.]/g, "") || 0);

  return (
    <div>
      <SectionTitle title="Salary Information" description="Expected compensation breakdown." />
      <h3 className="font-medium mb-3">Monthly Components (₹)</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {(Object.entries(s.monthly) as [keyof typeof s.monthly, number][]).map(([k, v]) => (
          <Field key={k} label={k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}>
            <Input type="number" value={v || ""} onChange={(e) => setM(k, num(e.target.value))} />
          </Field>
        ))}
      </div>
      <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
        <span className="text-muted-foreground">Monthly Gross:</span>{" "}
        <span className="font-semibold tabular-nums">₹ {monthlyGross.toLocaleString("en-IN")}</span>
      </div>

      <Separator className="my-6" />
      <h3 className="font-medium mb-3">Annual Components (₹)</h3>
      <div className="grid md:grid-cols-4 gap-4">
        {(Object.entries(s.annual) as [keyof typeof s.annual, number][]).map(([k, v]) => (
          <Field key={k} label={k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}>
            <Input type="number" value={v || ""} onChange={(e) => setA(k, num(e.target.value))} />
          </Field>
        ))}
      </div>
      <div className="mt-3 p-3 rounded-lg bg-success/10 border border-success/30 text-sm">
        <span className="text-muted-foreground">Annual Gross (incl. monthly × 12):</span>{" "}
        <span className="font-semibold tabular-nums">₹ {annualGross.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}

function StepDocuments({ docs, setDocs }: { docs: DocsState; setDocs: (d: DocsState) => void }) {
  return (
    <div>
      <SectionTitle title="Document Upload" description="Drag & drop or click to upload. PDF or images, max 5MB each." />
      <h3 className="font-medium mb-3 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-destructive" />Mandatory</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {requiredDocs.map((d) => (
          <FileUpload key={d.key} label={d.label} required value={docs[d.key]} onChange={(f) => setDocs({ ...docs, [d.key]: f })} />
        ))}
      </div>
      <Separator className="my-6" />
      <h3 className="font-medium mb-3 flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-info" />Optional</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {optionalDocs.map((d) => (
          <FileUpload key={d.key} label={d.label} value={docs[d.key]} onChange={(f) => setDocs({ ...docs, [d.key]: f })} />
        ))}
      </div>
    </div>
  );
}

function StepReview({
  form, docs, missingDocs, declaration, setDeclaration,
}: {
  form: Form; docs: DocsState;
  missingDocs: { key: keyof DocsState; label: string }[];
  declaration: boolean; setDeclaration: (v: boolean) => void;
}) {
  const p = form.personal ?? {};
  const uploadedCount = Object.values(docs).filter(Boolean).length;
  const summary = useMemo(() => [
    { label: "Name", value: [p.title, p.firstName, p.middleName, p.lastName].filter(Boolean).join(" ") || "—" },
    { label: "Email", value: p.email ?? "—" },
    { label: "Mobile", value: p.mobile ?? "—" },
    { label: "Date of Birth", value: p.dob ?? "—" },
    { label: "City", value: p.presentAddress?.city ?? "—" },
    { label: "Bank", value: form.bank?.bankName ?? "—" },
    { label: "PAN", value: form.identity?.pan ?? "—" },
    { label: "Total Experience", value: form.totalExperience ?? "—" },
    { label: "Education entries", value: String(form.education?.length ?? 0) },
    { label: "Certifications", value: String(form.certifications?.length ?? 0) },
    { label: "Employment entries", value: String(form.employment?.length ?? 0) },
    { label: "References", value: String(form.references?.length ?? 0) },
    { label: "Family members", value: String(form.family?.length ?? 0) },
    { label: "Documents uploaded", value: `${uploadedCount} / ${requiredDocs.length + optionalDocs.length}` },
  ], [form, p, uploadedCount]);

  return (
    <div>
      <SectionTitle title="Review & Submit" description="Verify your details before submitting." />

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Summary <StatusBadge status="Draft" /></CardTitle></CardHeader>
        <CardContent>
          <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {summary.map((s) => (
              <div key={s.label} className="flex justify-between gap-3 border-b border-dashed border-border/50 py-1.5">
                <dt className="text-muted-foreground">{s.label}</dt>
                <dd className="font-medium text-right truncate">{s.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {missingDocs.length > 0 && (
        <div className="mt-4 p-4 rounded-lg border border-destructive/30 bg-destructive/5">
          <div className="font-medium text-destructive mb-1">Missing required documents</div>
          <ul className="text-sm text-destructive/90 list-disc list-inside">
            {missingDocs.map((m) => <li key={m.key}>{m.label}</li>)}
          </ul>
        </div>
      )}

      <Card className="mt-4">
        <CardHeader className="pb-2"><CardTitle className="text-base">Declaration</CardTitle><CardDescription>Required for submission</CardDescription></CardHeader>
        <CardContent>
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox checked={declaration} onCheckedChange={(v) => setDeclaration(!!v)} className="mt-0.5" />
            <span className="text-sm">
              I hereby declare that all information provided in this form is true and accurate to the best of my knowledge. I understand that any false information may result in the cancellation of my application or termination of employment.
            </span>
          </label>
        </CardContent>
      </Card>
    </div>
  );
}