
# Enterprise HRMS Transformation Plan

This is a large transformation. I'll deliver it in a single coordinated build, but want to confirm scope before touching ~30+ files.

## 1. Design system upgrade
- Refine `src/styles.css`: enterprise blue palette in oklch, semantic tokens for status (success/warning/danger/info), surface levels, elevation shadows, focus rings.
- Add dark mode with persistent theme (localStorage + `ThemeProvider`), toggle in header.
- Typography: Inter for body, refined heading scale. Consistent radius, spacing.
- Polish shadcn variants (cards with subtle border + shadow, refined tables, badges, buttons).

## 2. Reusable UI primitives (new in `src/components/hrms/`)
- `StatCard`, `SectionCard`, `DataTable` (sortable, filterable, paginated, search), `FilterBar`, `EmptyState`, `LoadingSkeleton`, `ConfirmDialog`, `NotificationCenter`, `ThemeToggle`, `StepperProgress`, `FileUpload` (drag-drop, progress, preview), `FormField` wrappers.
- Framer Motion: page fade/slide, card hover lift, modal scale-in, status transitions.

## 3. Data layer (`src/data/`)
Normalized TypeScript models + mock data:
- `types.ts`: User, Candidate, Employee, Address, Education, Certification, EmploymentHistory, Skill, FamilyMember, Reference, EmergencyContact, Document, BankDetails, AttendanceRecord, LeaveRecord, LeaveBalance, Notification, OnboardingSubmission.
- `mockData.ts`: rich seeded data (20+ employees, 10+ candidates, attendance for current month, leave history, notifications).
- `services/` layer: `candidateService`, `employeeService`, `attendanceService`, `leaveService`, `notificationService`, `reportService` — async functions returning promises (backend-ready), backed by mock data + localStorage persistence for submissions.
- `leavePolicy.ts`: 1.75 days/month accrual logic, balance calculator, transaction history.

## 4. Candidate onboarding wizard (the centerpiece)
New route `/candidate/onboarding` with 15-step wizard:
1. Personal Details  2. Banking  3. Identity  4. Visa  5. Education (repeatable)  6. Certifications (repeatable)  7. Skills & Experience  8. Employment History (repeatable)  9. Professional Info  10. References (up to 3)  11. Family  12. Emergency Contact  13. Salary  14. Document Upload  15. Review & Submit with declaration.

- Left sidebar stepper, top progress bar, mobile = accordion.
- React Hook Form + Zod validation per step; persists draft to localStorage.
- Mandatory field/document gating before Submit.
- Drag-drop FileUpload with type/size validation, preview, replace, delete.
- Status workflow: Submitted → Under Review → HR Approved → HoD Approved → Offer Released (or Rejected with remarks).

## 5. Admin / HR modules (upgrade existing)
- **Dashboard**: KPIs (Total/Active/Present/On Leave/Attendance %/Pending Approvals/New Candidates), Department distribution (Pie), Employee growth (Line), Leave stats (Bar), Onboarding funnel, Recent activity feed, Quick actions.
- **Candidates**: DataTable with search/filter/status; detail page shows all 15 sections + document previews; Approve/Reject/Request Correction actions with remarks; status timeline.
- **Employees**: DataTable, profile drawer, department/role filters.
- **Attendance**: Calendar view, daily entry, monthly summary, department stats, export.
- **Leaves**: Apply/Approve/Reject workflow, balance tracker, transaction history, policy config screen.
- **Reports**: 5 report types with filters, charts, Export to Excel/PDF/Print (UI + working CSV download via blob).
- **Notifications**: Bell icon → dropdown panel; full notifications page; mark read/unread.
- **Settings**: Profile, org info, leave policy config, theme, notification prefs.

## 6. Candidate & Employee portals
- Candidate: dashboard with onboarding progress %, status timeline, documents, notifications.
- Employee: dashboard (attendance %, leave balance, recent payslips placeholder), attendance log, leave apply + history, profile.

## 7. Technical
- TanStack Router file-based routes; lazy load heavy routes.
- All forms use RHF + Zod.
- Recharts for visualizations.
- framer-motion for transitions.
- All colors via semantic tokens — no hard-coded hex.
- Mobile-first responsive (sidebar collapses, tables become cards on mobile).
- A11y: aria-labels on icon buttons, focus management in modals/wizard.

## Out of scope
- No real backend / DB / auth APIs (mock + localStorage only, as originally specified).
- Excel/PDF export = CSV blob download + print stylesheet (no heavy libs unless approved).
- Email/SMS notifications = in-app only.

## Deliverables (~35-45 files new/modified)
Routes, components, services, types, styles. Existing routes refactored to use new primitives without losing current functionality.

Shall I proceed with the full build, or would you like to scope down (e.g., onboarding wizard + dashboard first, rest in follow-ups)?
