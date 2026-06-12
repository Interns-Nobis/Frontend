// Legacy shapes — kept for backward compatibility while older routes get refactored.
// New code should import from "@/data/store" and "@/data/types".
export type CandidateStatus =
  | "Submitted"
  | "Under Review"
  | "Rejected"
  | "HR Manager Approved"
  | "HoD Approved"
  | "Offer Released";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  mobile: string;
  dob: string;
  address: string;
  degree: string;
  college: string;
  year: string;
  percentage: string;
  previousCompany: string;
  designation: string;
  experience: string;
  status: CandidateStatus;
  submissionDate: string;
  profileCompletion: number;
  remarks?: string;
}

export const mockCandidates: Candidate[] = [
  {
    id: "CAN001",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    mobile: "+91 98765 43210",
    dob: "1998-04-12",
    address: "Bangalore, Karnataka",
    degree: "B.Tech Computer Science",
    college: "IIT Bombay",
    year: "2020",
    percentage: "85%",
    previousCompany: "Infosys",
    designation: "Software Engineer",
    experience: "3 years",
    status: "Under Review",
    submissionDate: "2025-05-12",
    profileCompletion: 90,
  },
  {
    id: "CAN002",
    name: "Priya Iyer",
    email: "priya.iyer@example.com",
    mobile: "+91 99887 23410",
    dob: "1996-09-22",
    address: "Chennai, Tamil Nadu",
    degree: "M.Tech Data Science",
    college: "Anna University",
    year: "2022",
    percentage: "9.1 CGPA",
    previousCompany: "TCS",
    designation: "Data Analyst",
    experience: "2 years",
    status: "HR Manager Approved",
    submissionDate: "2025-05-10",
    profileCompletion: 100,
  },
  {
    id: "CAN003",
    name: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    mobile: "+91 90909 80808",
    dob: "1995-01-30",
    address: "Mumbai, Maharashtra",
    degree: "MBA Finance",
    college: "IIM Ahmedabad",
    year: "2021",
    percentage: "78%",
    previousCompany: "Deloitte",
    designation: "Consultant",
    experience: "4 years",
    status: "Submitted",
    submissionDate: "2025-05-20",
    profileCompletion: 65,
  },
  {
    id: "CAN004",
    name: "Sneha Kapoor",
    email: "sneha.kapoor@example.com",
    mobile: "+91 88776 54321",
    dob: "1999-07-15",
    address: "Delhi, India",
    degree: "B.Com",
    college: "Delhi University",
    year: "2021",
    percentage: "82%",
    previousCompany: "—",
    designation: "Fresher",
    experience: "0 years",
    status: "Rejected",
    submissionDate: "2025-04-28",
    profileCompletion: 80,
    remarks: "Required certifications not provided.",
  },
  {
    id: "CAN005",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    mobile: "+91 91234 56789",
    dob: "1994-11-03",
    address: "Pune, Maharashtra",
    degree: "B.E. Mechanical",
    college: "COEP Pune",
    year: "2017",
    percentage: "75%",
    previousCompany: "Mahindra",
    designation: "Design Engineer",
    experience: "6 years",
    status: "Offer Released",
    submissionDate: "2025-04-15",
    profileCompletion: 100,
  },
];

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  subDepartment: string;
  designation: string;
  doj: string;
  status: "Active" | "Disabled";
}

export const mockEmployees: Employee[] = [
  {
    id: "EMP001",
    name: "Admin User",
    email: "admin@nobis.com",
    department: "Management",
    subDepartment: "Executive",
    designation: "CEO",
    doj: "2020-01-01",
    status: "Active",
  },

  {
    id: "EMP002",
    name: "Rajesh Kumar",
    email: "delivery@nobis.com",
    department: "Technical Delivery",
    subDepartment: "Delivery",
    designation: "Delivery Head",
    doj: "2020-03-15",
    status: "Active",
  },

  {
    id: "EMP003",
    name: "Amit Sharma",
    email: "technical@nobis.com",
    department: "Technical",
    subDepartment: "SAP",
    designation: "Technical Head",
    doj: "2021-01-10",
    status: "Active",
  },

  {
    id: "EMP004",
    name: "Vikas Gupta",
    email: "abap.sr@nobis.com",
    department: "SAP",
    subDepartment: "SAP ABAP",
    designation: "Sr ABAP Consultant",
    doj: "2021-06-15",
    status: "Active",
  },

  {
    id: "EMP005",
    name: "Rahul Singh",
    email: "abap.jr@nobis.com",
    department: "SAP",
    subDepartment: "SAP ABAP",
    designation: "Jr ABAP Consultant",
    doj: "2024-02-01",
    status: "Active",
  },

  {
    id: "EMP006",
    name: "Neha Patel",
    email: "hr@nobis.com",
    department: "Support",
    subDepartment: "Human Resource",
    designation: "HR Manager",
    doj: "2021-08-10",
    status: "Active",
  },
];

export const mockDocuments = [
  { name: "PAN Card", file: "pan_card.pdf", uploaded: true },
  { name: "Aadhaar Card", file: "aadhaar.pdf", uploaded: true },
  { name: "Cancelled Cheque", file: "cheque.jpg", uploaded: true },
  { name: "SAP Certification", file: "", uploaded: false },
  { name: "Passport Size Photograph", file: "photo.jpg", uploaded: true },
  { name: "Previous Offer Letter", file: "offer.pdf", uploaded: true },
  { name: "Previous Relieving Letter", file: "", uploaded: false },
  { name: "Last 3 Months Salary Slips", file: "salary.pdf", uploaded: true },
  { name: "Passport", file: "", uploaded: false },
  { name: "Address Proof", file: "address.pdf", uploaded: true },
  { name: "Educational Certificates", file: "edu.pdf", uploaded: true },
];

export interface LeaveRequest {
  id: string;
  type: "Casual" | "Sick" | "Earned";
  from: string;
  to: string;
  status: "Pending" | "Approved" | "Rejected";
  reason: string;
  employeeName?: string;
}

export const mockLeaves: LeaveRequest[] = [
  { id: "L001", type: "Casual", from: "2025-05-20", to: "2025-05-21", status: "Approved", reason: "Family event", employeeName: "Ananya Rao" },
  { id: "L002", type: "Sick", from: "2025-05-25", to: "2025-05-26", status: "Pending", reason: "Fever", employeeName: "Karthik Nair" },
  { id: "L003", type: "Earned", from: "2025-06-10", to: "2025-06-14", status: "Pending", reason: "Vacation", employeeName: "Meera Joshi" },
  { id: "L004", type: "Casual", from: "2025-04-08", to: "2025-04-08", status: "Rejected", reason: "Personal", employeeName: "Rahul Khanna" },
];

export const mockAttendance = [
  { name: "Ananya Rao", date: "2025-05-29", status: "Present" },
  { name: "Karthik Nair", date: "2025-05-29", status: "Present" },
  { name: "Meera Joshi", date: "2025-05-29", status: "Leave" },
  { name: "Aditya Verma", date: "2025-05-29", status: "Absent" },
  { name: "Ishita Bose", date: "2025-05-29", status: "Present" },
  { name: "Rahul Khanna", date: "2025-05-29", status: "Present" },
];

export const statusDistribution = [
  { name: "Submitted", value: 12 },
  { name: "Under Review", value: 18 },
  { name: "Approved", value: 24 },
  { name: "Rejected", value: 6 },
  { name: "Offer Released", value: 9 },
];

export const departmentDistribution = [
  { name: "Engineering", value: 42 },
  { name: "Product", value: 14 },
  { name: "HR", value: 8 },
  { name: "Finance", value: 11 },
  { name: "Marketing", value: 9 },
];
