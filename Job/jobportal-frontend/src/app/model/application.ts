import { Manage } from './manage';
import { JobPosting } from './job-posting';

// A job application (matches the backend JobApplied entity)
export interface Application {
    id?: number;
    appliedDate?: string;
    status?: string;
    applicant?: JobPosting;
    job?: Manage;
}
