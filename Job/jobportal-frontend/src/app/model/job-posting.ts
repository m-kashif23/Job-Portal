// An applicant profile (matches the backend Applicant entity)
export interface JobPosting {
  id?: number;
  applicantName: string;
  contactNumber: string;
  email: string;
  resumeFileName?: string;
}
