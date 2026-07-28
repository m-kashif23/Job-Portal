// A job posting (matches the backend Job entity)
export interface Manage {
    id?: number;
    jobTitle: string;
    department: string;
    location: string;
    responsibility: string;
    qualification: string;
    deadLine: string;        // yyyy-MM-dd, matches LocalDate on the backend
    applicationFee: number;  // was "applicationFree" (typo fixed on both ends)
    category: string;        // "free" | "premium"
}
