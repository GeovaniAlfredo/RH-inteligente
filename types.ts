
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  JOB_GENERATOR = 'JOB_GENERATOR',
  CV_ANALYZER = 'CV_ANALYZER',
  INTERVIEW_SCRIPT = 'INTERVIEW_SCRIPT'
}

export interface JobDescription {
  title: string;
  department: string;
  seniority: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
}

export interface CVAnalysis {
  candidateName: string;
  score: number;
  reasoning: string;
  pros: string[];
  cons: string[];
  isCompatible: boolean;
}

export interface InterviewGuide {
  jobTitle: string;
  questions: {
    category: string;
    question: string;
    expectedAnswer: string;
  }[];
}
