import type {
  Candidate, Employee, AttendanceRecord, LeaveRequest, LeaveBalance,
  LeaveTransaction, Notification, ActivityEvent, LeavePolicy, StatusHistoryEntry,
} from "./types";

const today = new Date();
const iso = (d: Date) => d.toISOString().split("T")[0];
const daysAgo = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return iso(d); };

export const defaultLeavePolicy: LeavePolicy = {
  monthlyAccrual: 1.75,
  maxCarryForward: 30,
  allowNegativeBalance: false,
  workingDaysPerWeek: 5,
};

const hist = (entries: Array<Partial<StatusHistoryEntry> & { status: StatusHistoryEntry["status"]; at: string }>): StatusHistoryEntry[] =>
  entries.map((e, i) => ({ id: `h${i}`, by: e.by ?? "System", remarks: e.remarks, ...e }));

export const seedCandidates: Candidate[] = [
  {
    id: "CAN001", name: "Aarav Sharma", email: "aarav.sharma@example.com",
    mobile: "+91 98765 43210", dob: "1998-04-12", city: "Bangalore",
    degree: "B.Tech CS", experience: "3 yrs", designation: "Software Engineer",
    status: "Under Review", submittedAt: daysAgo(4), profileCompletion: 92,
    history: hist([
      { status: "Submitted", at: daysAgo(4), by: "Aarav Sharma" },
      { status: "Under Review", at: daysAgo(3), by: "HR Team" },
    ]),
  },
  {
    id: "CAN002", name: "Priya Iyer", email: "priya.iyer@example.com",
    mobile: "+91 99887 23410", dob: "1996-09-22", city: "Chennai",
    degree: "M.Tech Data Science", experience: "2 yrs", designation: "Data Analyst",
    status: "HR Manager Approved", submittedAt: daysAgo(6), profileCompletion: 100,
    history: hist([
      { status: "Submitted", at: daysAgo(6), by: "Priya Iyer" },
      { status: "Under Review", at: daysAgo(5), by: "HR Team" },
      { status: "HR Manager Approved", at: daysAgo(2), by: "Meera Joshi", remarks: "Strong technical fit." },
    ]),
  },
  {
    id: "CAN003", name: "Rohan Mehta", email: "rohan.mehta@example.com",
    mobile: "+91 90909 80808", dob: "1995-01-30", city: "Mumbai",
    degree: "MBA Finance", experience: "4 yrs", designation: "Consultant",
    status: "Submitted", submittedAt: daysAgo(1), profileCompletion: 70,
    history: hist([{ status: "Submitted", at: daysAgo(1), by: "Rohan Mehta" }]),
  },
  {
    id: "CAN004", name: "Sneha Kapoor", email: "sneha.kapoor@example.com",
    mobile: "+91 88776 54321", dob: "1999-07-15", city: "Delhi",
    degree: "B.Com", experience: "0 yrs", designation: "Fresher",
    status: "Rejected", submittedAt: daysAgo(15), profileCompletion: 80,
    remarks: "Required certifications not provided.",
    history: hist([
      { status: "Submitted", at: daysAgo(15), by: "Sneha Kapoor" },
      { status: "Under Review", at: daysAgo(14), by: "HR Team" },
      { status: "Rejected", at: daysAgo(10), by: "Meera Joshi", remarks: "Required certifications not provided." },
    ]),
  },
  {
    id: "CAN005", name: "Vikram Singh", email: "vikram.singh@example.com",
    mobile: "+91 91234 56789", dob: "1994-11-03", city: "Pune",
    degree: "B.E. Mechanical", experience: "6 yrs", designation: "Design Engineer",
    status: "Offer Released", submittedAt: daysAgo(30), profileCompletion: 100,
    history: hist([
      { status: "Submitted", at: daysAgo(30), by: "Vikram Singh" },
      { status: "Under Review", at: daysAgo(28), by: "HR Team" },
      { status: "HR Manager Approved", at: daysAgo(22), by: "Meera Joshi" },
      { status: "HoD Approved", at: daysAgo(18), by: "Karthik Nair" },
      { status: "Offer Released", at: daysAgo(15), by: "HR Team", remarks: "Offer letter sent." },
    ]),
  },
  {
    id: "CAN006", name: "Anjali Reddy", email: "anjali.reddy@example.com",
    mobile: "+91 91111 22222", dob: "1997-03-08", city: "Hyderabad",
    degree: "B.Tech ECE", experience: "1 yr", designation: "QA Engineer",
    status: "HoD Approved", submittedAt: daysAgo(12), profileCompletion: 100,
    history: hist([
      { status: "Submitted", at: daysAgo(12), by: "Anjali Reddy" },
      { status: "Under Review", at: daysAgo(11), by: "HR Team" },
      { status: "HR Manager Approved", at: daysAgo(8), by: "Meera Joshi" },
      { status: "HoD Approved", at: daysAgo(3), by: "Karthik Nair" },
    ]),
  },
  {
    id: "CAN007", name: "Devansh Patel", email: "devansh.patel@example.com",
    mobile: "+91 93434 56789", dob: "2000-12-19", city: "Ahmedabad",
    degree: "BCA", experience: "0.5 yrs", designation: "Frontend Developer",
    status: "Submitted", submittedAt: daysAgo(2), profileCompletion: 55,
    history: hist([{ status: "Submitted", at: daysAgo(2), by: "Devansh Patel" }]),
  },
  {
    id: "CAN008", name: "Kavya Nambiar", email: "kavya.n@example.com",
    mobile: "+91 94567 12345", dob: "1995-06-25", city: "Kochi",
    degree: "M.A. HR", experience: "5 yrs", designation: "HR Business Partner",
    status: "Under Review", submittedAt: daysAgo(7), profileCompletion: 88,
    history: hist([
      { status: "Submitted", at: daysAgo(7), by: "Kavya Nambiar" },
      { status: "Under Review", at: daysAgo(6), by: "HR Team" },
    ]),
  },
];

const departments = ["Engineering", "Product", "HR", "Finance", "Marketing", "Sales", "Design"];
const designations = ["Engineer", "Senior Engineer", "Lead", "Manager", "Director", "Analyst", "Specialist"];
const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4"];

export const seedEmployees: Employee[] = Array.from({ length: 24 }, (_, i) => {
  const dept = departments[i % departments.length];
  return {
    id: `EMP${String(i + 1).padStart(3, "0")}`,
    empCode: `E-${1000 + i}`,
    name: [
      "Ananya Rao", "Karthik Nair", "Meera Joshi", "Aditya Verma", "Ishita Bose",
      "Rahul Khanna", "Neha Gupta", "Arjun Kapoor", "Divya Menon", "Sanjay Kumar",
      "Riya Shah", "Vivek Pillai", "Sneha Roy", "Tarun Das", "Pooja Iyer",
      "Mohit Bansal", "Lakshmi Nair", "Harsh Singh", "Aditi Sen", "Nikhil Jain",
      "Shruti Verma", "Rohit Pawar", "Kiran Rao", "Maya Krishnan",
    ][i],
    email: `employee${String(i + 1).padStart(3, "0")}@company.com`,
    department: dept,
    designation: designations[i % designations.length],
    doj: daysAgo(60 + i * 30),
    manager: i > 0 ? `EMP${String(((i - 1) % 5) + 1).padStart(3, "0")}` : undefined,
    location: ["Bangalore", "Mumbai", "Delhi", "Chennai", "Hyderabad"][i % 5],
    status: i === 3 ? "Disabled" : i === 8 || i === 14 ? "On Leave" : "Active",
    avatarColor: colors[i % colors.length],
  };
});

// Attendance for the last 30 days
export const seedAttendance: AttendanceRecord[] = (() => {
  const rows: AttendanceRecord[] = [];
  for (let d = 0; d < 30; d++) {
    const date = daysAgo(d);
    const day = new Date(date).getDay();
    const isWeekend = day === 0 || day === 6;
    seedEmployees.forEach((emp, idx) => {
      const r = (idx + d) % 10;
      let status: AttendanceRecord["status"] = "Present";
      if (isWeekend) status = "Holiday";
      else if (r === 0) status = "Absent";
      else if (r === 1) status = "Leave";
      else if (r === 2) status = "WFH";
      rows.push({
        id: `${emp.id}-${date}`, employeeId: emp.id, date, status,
        checkIn: status === "Present" || status === "WFH" ? "09:15" : undefined,
        checkOut: status === "Present" || status === "WFH" ? "18:30" : undefined,
        hours: status === "Present" || status === "WFH" ? 8.5 : 0,
      });
    });
  }
  return rows;
})();

export const seedLeaves: LeaveRequest[] = [
  { id: "L001", employeeId: "EMP001", employeeName: "Ananya Rao", type: "Casual", from: daysAgo(-3), to: daysAgo(-2), days: 2, reason: "Family event", status: "Approved", appliedAt: daysAgo(5), approvedBy: "Meera Joshi" },
  { id: "L002", employeeId: "EMP002", employeeName: "Karthik Nair", type: "Sick", from: daysAgo(1), to: daysAgo(0), days: 2, reason: "Fever and rest advised", status: "Pending", appliedAt: daysAgo(2) },
  { id: "L003", employeeId: "EMP003", employeeName: "Meera Joshi", type: "Earned", from: daysAgo(-10), to: daysAgo(-6), days: 5, reason: "Annual vacation", status: "Pending", appliedAt: daysAgo(1) },
  { id: "L004", employeeId: "EMP006", employeeName: "Rahul Khanna", type: "Casual", from: daysAgo(20), to: daysAgo(20), days: 1, reason: "Personal work", status: "Rejected", appliedAt: daysAgo(22), remarks: "Insufficient notice." },
  { id: "L005", employeeId: "EMP005", employeeName: "Ishita Bose", type: "Earned", from: daysAgo(-15), to: daysAgo(-13), days: 3, reason: "Wedding", status: "Approved", appliedAt: daysAgo(4), approvedBy: "Meera Joshi" },
  { id: "L006", employeeId: "EMP009", employeeName: "Divya Menon", type: "Sick", from: daysAgo(8), to: daysAgo(7), days: 2, reason: "Migraine", status: "Approved", appliedAt: daysAgo(9), approvedBy: "Meera Joshi" },
];

export const seedLeaveBalances: LeaveBalance[] = seedEmployees.map((emp, i) => {
  const earned = +(1.75 * 12).toFixed(2);
  const used = (i % 6) + 1;
  return { employeeId: emp.id, earned, used, remaining: +(earned - used).toFixed(2), asOf: iso(today) };
});

export const seedLeaveTransactions: LeaveTransaction[] = seedEmployees.slice(0, 6).flatMap((emp, i) => [
  { id: `T${i}1`, employeeId: emp.id, type: "Accrual" as const, amount: 1.75, date: daysAgo(60), note: "Monthly accrual", balanceAfter: 1.75 },
  { id: `T${i}2`, employeeId: emp.id, type: "Accrual" as const, amount: 1.75, date: daysAgo(30), note: "Monthly accrual", balanceAfter: 3.5 },
  { id: `T${i}3`, employeeId: emp.id, type: "Used" as const, amount: -1, date: daysAgo(15), note: "Casual leave", balanceAfter: 2.5 },
  { id: `T${i}4`, employeeId: emp.id, type: "Accrual" as const, amount: 1.75, date: daysAgo(1), note: "Monthly accrual", balanceAfter: 4.25 },
]);

export const seedNotifications: Notification[] = [
  {
    id: "N001",
    userId: "ADMIN",
    type: "info",
    title: "New candidate registered",
    body: "Devansh Patel started onboarding.",
    read: false,
    createdAt: daysAgo(0),
    link: "/admin/candidates",
  },

  {
    id: "N002",
    userId: "ADMIN",
    type: "warning",
    title: "3 leave requests pending",
    body: "Approval required.",
    read: false,
    createdAt: daysAgo(0),
    link: "/admin/leaves",
  },

  {
    id: "N003",
    userId: "ADMIN",
    type: "success",
    title: "Offer released",
    body: "Vikram Singh accepted the offer.",
    read: true,
    createdAt: daysAgo(2),
    link: "/admin/candidates",
  },

  {
    id: "N004",
    userId: "EMP001",
    type: "success",
    title: "Leave Approved",
    body: "Your leave request has been approved.",
    read: false,
    createdAt: daysAgo(1),
    link: "/employee/leave-management",
  },
];

export const seedActivity: ActivityEvent[] = [
  { id: "A1", actor: "Meera Joshi", action: "approved candidate", target: "Priya Iyer", at: daysAgo(0) },
  { id: "A2", actor: "Karthik Nair", action: "approved leave for", target: "Ishita Bose", at: daysAgo(0) },
  { id: "A3", actor: "System", action: "credited monthly leave to", target: "All employees", at: daysAgo(1) },
  { id: "A4", actor: "HR Team", action: "moved to review", target: "Aarav Sharma", at: daysAgo(3) },
  { id: "A5", actor: "Vikram Singh", action: "accepted offer", target: "Design Engineer role", at: daysAgo(2) },
];

export const employeeGrowth = [
  { month: "Jan", employees: 142 },
  { month: "Feb", employees: 148 },
  { month: "Mar", employees: 156 },
  { month: "Apr", employees: 163 },
  { month: "May", employees: 172 },
  { month: "Jun", employees: 178 },
];

export const candidateFunnel = [
  { stage: "Submitted", count: 24 },
  { stage: "Under Review", count: 18 },
  { stage: "HR Approved", count: 12 },
  { stage: "HoD Approved", count: 8 },
  { stage: "Offer Released", count: 5 },
];