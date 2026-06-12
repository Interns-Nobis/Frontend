// Lightweight reactive store backed by localStorage. Backend-ready: each
// service method is async and can be swapped to a real API later.
import { useSyncExternalStore } from "react";
import {
  seedCandidates, seedEmployees, seedAttendance, seedLeaves,
  seedLeaveBalances, seedLeaveTransactions, seedNotifications,
  seedActivity, defaultLeavePolicy,
} from "./seedData";
import type {
  Candidate, Employee, AttendanceRecord, LeaveRequest, LeaveBalance,
  LeaveTransaction, Notification, ActivityEvent, LeavePolicy,
  OnboardingSubmission, CandidateStatus,
  Account,
} from "./types";

interface DBShape {
  candidates: Candidate[];
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  leaveTransactions: LeaveTransaction[];
  notifications: Notification[];
  activity: ActivityEvent[];
  leavePolicy: LeavePolicy;
  submissions: OnboardingSubmission[];
  draft: Partial<OnboardingSubmission> | null;
  accounts: Account[];
  currentUser: { email: string; role: string; candidateId?: string } | null;
}

const KEY = "hrms-db-v1";
const initial: DBShape = {
  candidates: seedCandidates,
  employees: seedEmployees,
  attendance: seedAttendance,
  leaves: seedLeaves,
  leaveBalances: seedLeaveBalances,
  leaveTransactions: seedLeaveTransactions,
  notifications: seedNotifications,
  activity: seedActivity,
  leavePolicy: defaultLeavePolicy,
  submissions: [],
  draft: null,
  accounts: [],
  currentUser: null,
};

function load(): DBShape {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch { return initial; }
}

let db: DBShape = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window !== "undefined") {
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {}
  }
  listeners.forEach((l) => l());
}

export function getDB(): DBShape { return db; }
export function setDB(updater: (d: DBShape) => DBShape) { db = updater(db); persist(); }
export function subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; }

export function useDB<T>(selector: (d: DBShape) => T): T {
  return useSyncExternalStore(subscribe, () => selector(db), () => selector(initial));
}

export function resetDB() { db = initial; persist(); }

// ---- ID + date helpers ----
export const uid = (p = "ID") => `${p}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
export const nowISO = () => new Date().toISOString();

// ---- Candidate ops ----
export function updateCandidateStatus(id: string, status: CandidateStatus, by: string, remarks?: string) {
  setDB((d) => ({
    ...d,
    candidates: d.candidates.map((c) =>
      c.id === id
        ? {
            ...c,
            status,
            remarks: remarks ?? c.remarks,
            history: [...c.history, { id: uid("H"), status, at: nowISO(), by, remarks }],
          }
        : c
    ),
    notifications: [
      {
        id: uid("N"),
        userId: id,
        type: status === "Rejected" ? "error" : status === "Correction Requested" ? "warning" : status === "Offer Released" ? "success" : "info",
        title: `Application ${status}`,
        body: remarks ? remarks : `Your application status changed to ${status}.`,
        read: false,
        createdAt: nowISO(),
        link: "/candidate/status",
      },
      ...d.notifications,
    ],
    activity: [
      { id: uid("A"), actor: by, action: `set status to ${status} for`, target: d.candidates.find((c) => c.id === id)?.name ?? id, at: nowISO() },
      ...d.activity,
    ].slice(0, 50),
  }));
}

// ---- Auth ops ----
/** Convert ISO date (YYYY-MM-DD) to DDMMYYYY password format */
export function dobToPassword(dob: string): string {
  if (!dob) return "";
  const [y, m, d] = dob.split("-");
  if (!y || !m || !d) return dob.replace(/\D/g, "");
  return `${d}${m}${y}`;
}

export function createCandidateAccount(email: string, dob: string, candidateId: string) {
  const password = dobToPassword(dob);
  setDB((d) => ({
    ...d,
    accounts: [
      ...d.accounts.filter((a) => a.email.toLowerCase() !== email.toLowerCase()),
      { email: email.toLowerCase(), password, role: "candidate", candidateId, mustChangePassword: true, createdAt: nowISO() },
    ],
  }));
  return password;
}

export function loginAccount(email: string, password: string): { ok: boolean; mustChange?: boolean; role?: string; candidateId?: string; error?: string } {
  const acc = db.accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
  if (!acc) return { ok: false, error: "No account found for this email." };
  if (acc.password !== password) return { ok: false, error: "Incorrect password." };
  setDB((d) => ({ ...d, currentUser: { email: acc.email, role: acc.role, candidateId: acc.candidateId } }));
  return { ok: true, mustChange: acc.mustChangePassword, role: acc.role, candidateId: acc.candidateId };
}

export function changePassword(email: string, newPassword: string) {
  setDB((d) => ({
    ...d,
    accounts: d.accounts.map((a) =>
      a.email.toLowerCase() === email.toLowerCase()
        ? { ...a, password: newPassword, mustChangePassword: false }
        : a
    ),
  }));
}

export function logout() {
  setDB((d) => ({ ...d, currentUser: null }));
}

export function requestCorrection(candidateId: string, by: string, remarks: string) {
  updateCandidateStatus(candidateId, "Correction Requested", by, remarks);
}

// ---- Leave ops ----
export function applyLeave(req: Omit<LeaveRequest, "id" | "status" | "appliedAt">) {
  const id = uid("L");
  setDB((d) => ({
    ...d,
    leaves: [{ ...req, id, status: "Pending", appliedAt: nowISO() }, ...d.leaves],
    notifications: [
      { id: uid("N"), userId: "ALL", type: "info", title: "Leave request submitted", body: `${req.employeeName} requested ${req.days} day(s) of ${req.type} leave.`, read: false, createdAt: nowISO(), link: "/admin/leaves" },
      ...d.notifications,
    ],
  }));
  return id;
}

export function decideLeave(id: string, status: "Approved" | "Rejected", by: string, remarks?: string) {
  setDB((d) => {
    const leave = d.leaves.find((l) => l.id === id);
    if (!leave) return d;
    const leaves = d.leaves.map((l) => l.id === id ? { ...l, status, approvedBy: by, remarks } : l);
    let balances = d.leaveBalances;
    let txns = d.leaveTransactions;
    if (status === "Approved") {
      balances = d.leaveBalances.map((b) =>
        b.employeeId === leave.employeeId
          ? { ...b, used: +(b.used + leave.days).toFixed(2), remaining: +(b.remaining - leave.days).toFixed(2), asOf: new Date().toISOString().split("T")[0] }
          : b
      );
      const bal = balances.find((b) => b.employeeId === leave.employeeId);
      txns = [
        { id: uid("T"), employeeId: leave.employeeId, type: "Used", amount: -leave.days, date: new Date().toISOString().split("T")[0], note: `${leave.type} leave`, balanceAfter: bal?.remaining ?? 0 },
        ...d.leaveTransactions,
      ];
    }
    return {
      ...d,
      leaves,
      leaveBalances: balances,
      leaveTransactions: txns,
      notifications: [
        { id: uid("N"), userId: leave.employeeId, type: status === "Approved" ? "success" : "warning", title: `Leave ${status.toLowerCase()}`, body: `${leave.type} leave from ${leave.from} to ${leave.to}.`, read: false, createdAt: nowISO() },
        ...d.notifications,
      ],
      activity: [{ id: uid("A"), actor: by, action: `${status.toLowerCase()} leave for`, target: leave.employeeName, at: nowISO() }, ...d.activity].slice(0, 50),
    };
  });
}

// ---- Attendance ops ----
export function markAttendance(employeeId: string, date: string, status: AttendanceRecord["status"]) {
  setDB((d) => {
    const key = `${employeeId}-${date}`;
    const existing = d.attendance.find((a) => a.id === key);
    const rec: AttendanceRecord = existing
      ? { ...existing, status }
      : { id: key, employeeId, date, status, checkIn: "09:15", checkOut: "18:30", hours: status === "Present" ? 8.5 : 0 };
    const attendance = existing
      ? d.attendance.map((a) => a.id === key ? rec : a)
      : [rec, ...d.attendance];
    return { ...d, attendance };
  });
}

// ---- Notifications ----
export function markNotificationRead(id: string) {
  setDB((d) => ({ ...d, notifications: d.notifications.map((n) => n.id === id ? { ...n, read: true } : n) }));
}
export function markAllRead() {
  setDB((d) => ({ ...d, notifications: d.notifications.map((n) => ({ ...n, read: true })) }));
}

// ---- Leave policy ----
export function updateLeavePolicy(policy: Partial<LeavePolicy>) {
  setDB((d) => ({ ...d, leavePolicy: { ...d.leavePolicy, ...policy } }));
}

// ---- Onboarding draft + submission ----
export function saveDraft(draft: Partial<OnboardingSubmission>) {
  setDB((d) => ({ ...d, draft: { ...d.draft, ...draft, updatedAt: nowISO() } }));
}
export function loadDraft(): Partial<OnboardingSubmission> | null { return db.draft; }
export function submitOnboarding(submission: OnboardingSubmission) {
  const email = (submission.personal.email ?? "").toLowerCase();
  const dob = submission.personal.dob ?? "";
  const password = dobToPassword(dob);
  setDB((d) => ({
    ...d,
    submissions: [submission, ...d.submissions.filter((s) => s.candidateId !== submission.candidateId)],
    draft: null,
    accounts: email
      ? [
          ...d.accounts.filter((a) => a.email !== email),
          { email, password, role: "candidate", candidateId: submission.candidateId, mustChangePassword: true, createdAt: nowISO() },
        ]
      : d.accounts,
    candidates: [
      {
        id: submission.candidateId,
        name: `${submission.personal.firstName ?? ""} ${submission.personal.lastName ?? ""}`.trim() || "New Candidate",
        email: submission.personal.email ?? "",
        mobile: submission.personal.mobile ?? "",
        dob: submission.personal.dob ?? "",
        city: submission.personal.presentAddress?.city ?? "",
        degree: submission.education[0]?.qualification ?? "",
        experience: submission.totalExperience ?? "0 yrs",
        designation: submission.employment[0]?.designation ?? "Applicant",
        status: "Submitted",
        submittedAt: nowISO(),
        profileCompletion: 100,
        history: [{ id: uid("H"), status: "Submitted", at: nowISO(), by: "Candidate" }],
      },
      ...d.candidates.filter((c) => c.id !== submission.candidateId),
    ],
    notifications: [
      {
        id: uid("N"), userId: submission.candidateId, type: "success",
        title: "Registration successful",
        body: `Account created. Username: ${email}. Temporary password: your DOB (DDMMYYYY = ${password}).`,
        read: false, createdAt: nowISO(), link: "/candidate/status",
      },
      { id: uid("N"), userId: "ALL", type: "success", title: "New candidate submission", body: `${submission.personal.firstName ?? "Candidate"} ${submission.personal.lastName ?? ""} submitted onboarding.`, read: false, createdAt: nowISO(), link: "/admin/candidates" },
      ...d.notifications,
    ],
  }));
  return { email, password };
}