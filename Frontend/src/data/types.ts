// ============================================================
// HRMS Domain Models — backend-ready, normalized.
// ============================================================

export type UserRole = "candidate" | "employee" | "admin" | "hr" | "hod";
export type CandidateStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Rejected"
  | "Correction Requested"
  | "HR Manager Approved"
  | "HoD Approved"
  | "Offer Released";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
}

export interface Account {
  email: string;
  password: string; // DOB DDMMYYYY initially
  role: UserRole;
  candidateId?: string;
  mustChangePassword: boolean;
  createdAt: string;
}

export interface Address {
  line1: string;
  city: string;
  state: string;
  pincode: string;
  homeTelephone?: string;
}

export interface PersonalDetails {
  title: "Mr" | "Mrs" | "Ms" | "Dr";
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  mobile: string;
  email: string;
  motherTongue: string;
  presentAddress: Address;
  permanentAddress: Address;
  sameAsPresent?: boolean;
}

export interface BankDetails {
  bankName: string;
  branch: string;
  ifsc: string;
  accountNumber: string;
  cancelledChequeDocId?: string;
}

export interface IdentityInfo {
  pan: string;
  aadhaar: string;
  drivingLicense?: string;
  passport?: string;
  passportExpiry?: string;
  placeOfIssue?: string;
  citizenship: string;
  panDocId?: string;
  aadhaarDocId?: string;
  passportDocId?: string;
}

export interface VisaInfo {
  appliedForVisa: "Yes" | "No";
  visaRejected: "Yes" | "No";
  rejectionCountry?: string;
  rejectionDate?: string;
  rejectionReason?: string;
}

export interface Education {
  id: string;
  category: string;
  qualification: string;
  university: string;
  yearFrom: string;
  yearTo: string;
  percentage: string;
  achievements?: string;
  certificateDocId?: string;
}

export interface Certification {
  id: string;
  name: string;
  year: string;
  documentId?: string;
}

export interface Skill {
  id: string;
  type: "Technical" | "Functional";
  name: string;
  experience: string;
}

export interface EmploymentHistory {
  id: string;
  organization: string;
  designation: string;
  fromDate: string;
  toDate: string;
  responsibilities: string;
  teamSize?: string;
  managerial?: "Yes" | "No";
  compensation?: string;
  offerLetterDocId?: string;
  relievingLetterDocId?: string;
  salarySlipsDocId?: string;
  bankStatementDocId?: string;
}

export interface ProfessionalInfo {
  achievements?: string;
  awards?: string;
  extraCurricular?: string;
  relativesInCompany: "Yes" | "No";
  relativeName?: string;
  relativeRelation?: string;
  relativeYearsKnown?: string;
}

export interface Reference {
  id: string;
  name: string;
  relationship: string;
  yearsKnown: string;
  company: string;
  occupation: string;
  homePhone?: string;
  businessPhone?: string;
}

export interface FamilyMember {
  id: string;
  relation: "Father" | "Mother" | "Spouse" | "Child";
  name: string;
  dob: string;
  occupation: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
  telephone?: string;
}

export interface SalaryInfo {
  monthly: {
    basic: number;
    hra: number;
    conveyance: number;
    utilityAllowance: number;
    adhocAllowance: number;
    skillAllowance: number;
  };
  annual: {
    medical: number;
    lta: number;
    pf: number;
    gratuity: number;
    bonus: number;
    foodFacility: number;
    mediclaim: number;
    superannuation: number;
  };
}

export type DocumentCategory =
  | "PAN"
  | "Aadhaar"
  | "Photograph"
  | "CancelledCheque"
  | "EducationalCertificates"
  | "AddressProof"
  | "Passport"
  | "SAPCertification"
  | "OfferLetter"
  | "RelievingLetter"
  | "SalarySlips"
  | "BankStatement"
  | "Other";

export interface DocumentRecord {
  id: string;
  category: DocumentCategory;
  label: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  required: boolean;
  // base64 preview for image previews (mock only)
  dataUrl?: string;
}

export interface StatusHistoryEntry {
  id: string;
  status: CandidateStatus;
  at: string;
  by: string;
  remarks?: string;
}

export interface OnboardingSubmission {
  id: string;
  candidateId: string;
  personal: Partial<PersonalDetails>;
  bank: Partial<BankDetails>;
  identity: Partial<IdentityInfo>;
  visa: Partial<VisaInfo>;
  education: Education[];
  certifications: Certification[];
  skills: Skill[];
  totalExperience?: string;
  employment: EmploymentHistory[];
  professional: Partial<ProfessionalInfo>;
  references: Reference[];
  family: FamilyMember[];
  emergency: Partial<EmergencyContact>;
  salary?: SalaryInfo;
  documents: DocumentRecord[];
  declarationAccepted: boolean;
  status: CandidateStatus;
  history: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  mobile: string;
  dob: string;
  city: string;
  degree: string;
  experience: string;
  designation: string;
  status: CandidateStatus;
  submittedAt: string;
  profileCompletion: number;
  remarks?: string;
  history: StatusHistoryEntry[];
}

export interface Employee {
  id: string;
  empCode: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  doj: string;
  manager?: string;
  location: string;
  status: "Active" | "On Leave" | "Disabled";
  avatarColor?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: "Present" | "Absent" | "Leave" | "WFH" | "Holiday";
  checkIn?: string;
  checkOut?: string;
  hours?: number;
}

export type LeaveType = "Casual" | "Sick" | "Earned" | "Unpaid";
export type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: LeaveType;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  approvedBy?: string;
  remarks?: string;
}

export interface LeaveBalance {
  employeeId: string;
  earned: number;
  used: number;
  remaining: number;
  asOf: string;
}

export interface LeaveTransaction {
  id: string;
  employeeId: string;
  type: "Accrual" | "Used" | "Adjustment";
  amount: number;
  date: string;
  note: string;
  balanceAfter: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ActivityEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
}

export interface LeavePolicy {
  monthlyAccrual: number; // default 1.75
  maxCarryForward: number;
  allowNegativeBalance: boolean;
  workingDaysPerWeek: number;
}

export interface Notification {
  notif_id: number;
  concerned_employee_id: number;
  recipient_type: "ADMIN" | "EMPLOYEE" | "CANDIDATE";
  notif_type:
    | "LEAVE_REQUEST"
    | "LEAVE_APPROVED"
    | "LEAVE_REJECTED"
    | "NEW_CANDIDATE"
    | "OFFER_ACCEPTED"
    | "CANDIDATE_REJECTED"
    | "MOVED_TO_REVIEW"
    | "HR_APPROVED"
    | "HOD_APPROVED"
    | "OFFER_RECEIVED";
  title: string;
  notif_content: string;
  notif_status: "Read" | "Unread";
  created_at: string;
}