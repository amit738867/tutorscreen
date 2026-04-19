export {};

declare global {
  type FormType = "sign-in" | "sign-up";

  interface User {
    id: string;
    name: string;
    email: string;
    persona?: string;
    voiceEnabled?: boolean;
    avatar?: string;
  }

  interface SignUpParams {
    uid: string;
    name: string;
    email: string;
  }

  interface SignInParams {
    email: string;
    idToken: string;
  }
  interface Interview {
    id: string;
    userId: string;
    role: string;
    type: string;
    techstack: string[];
    questions: string[];
    finalized: boolean;
    createdAt: string;
    feedback?: any;
  }

  interface Feedback {
    id: string;
    interviewId: string;
    userId: string;
    totalScore: number;
    clarity: { score: number; explanation: string };
    simplicity: { score: number; explanation: string };
    patience: { score: number; explanation: string };
    fluency: { score: number; explanation: string };
    warmth: { score: number; explanation: string };
    finalVerdict: "Selected" | "Rejected";
    summary: string;
    evidence: string;
    createdAt: string;
  }

  interface GetLatestInterviewsParams {
    userId?: string;
    limit?: number;
  }

  interface CreateFeedbackParams {
    interviewId: string;
    userId: string;
    transcript: { role: string; content: string }[];
    feedbackId?: string;
  }

  interface GetFeedbackByInterviewIdParams {
    interviewId: string;
    userId: string;
  }

  interface RouteParams {
    params: Promise<{ id: string }>;
  }

  interface InterviewCardProps {
    interviewId: string;
    userId?: string;
    role: string;
    type: string;
    techstack: string[];
    createdAt: string;
  }
}
