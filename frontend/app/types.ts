export type TeachingInput = {
  topic: string;
  classLevel: string;
  engagement?: "low" | "medium" | "high" | "very_high"; // ✅ optional
};

export type QuestionResponse = {
  questions: string[];
};

// export type Engagement = "low" | "medium" | "high" | "very_high";

// export type FeedbackInput = {
//   topic: string;
//   subject: string;
//   classLevel: string;
//   engagement: Engagement;
// };

export type FeedbackInput = {
  // topic: string;
  // subject: string;
  // classLevel: string;
  // score: number;
  engagement: "low" | "medium" | "high" | "very_high";
};

export type SubjectStat = {
  subject: string;
  avgMemory: number;
  count: number;
};

export type WeakestSubject = {
  subject: string;
  avgMemory: number;
  count: number;
} | null;

export type WeeklyPlanItem = {
  concept: string;
  subject: string;
  date: string;
};

export type RevisionResponse = {
  dueToday: any[];
  upcoming: any[];
  retentionScore: number;
  subjectStats: SubjectStat[];
  weakestSubject: WeakestSubject;
  suggestion: string;
  weeklyPlan: WeeklyPlanItem[];
};
