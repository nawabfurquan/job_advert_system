export interface Job {
  jobId: string;
  title: string;
  company: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  skills?: string[];
  jobType?: string;
  salary?: number;
  industry?: string;
  location?: string;
  postedDate?: string;
  deadline?: string;
}

export interface UserInfo {
  email: string;
  name: string;
  phone: number;
  resume: any;
  coverLetter: any;
  location: string;
}

export interface Application {
  applicationId: string;
  jobTitle: string;
  jobCompany: string;
  userName: string;
  userEmail: string;
  status: "Pending" | "Approved" | "Rejected";
  userInfo: UserInfo;
  date: string;
}

export interface Preferences {
  jobType: string[];
  location: string[];
  industry: string[];
  salary: number;
}

export interface User {
  userId: string;
  email: string;
  name: string;
  phone: number;
  isAdmin: boolean;
  location: string;
  preferences: Preferences;
  skills: string[];
  experience: number;
  resume?: any;
  lastUpdated: string;
  interactions?: string[];
}
