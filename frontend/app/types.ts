export type TeachingInput = {
  topic: string;
  classLevel: string;
  engagement?: "low" | "medium" | "high" | "very_high"; // ✅ optional
};

export type QuestionResponse = {
  questions: string[];
};

export type FeedbackInput = {
  engagement: string;
  child_id: string;
  teachResult: {
    teach: string;
    questions?: string[];
    parentTip?: string;
    prerequisite?: any;
  };
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

export type InsightResponse = {
  summary: string;

  pattern: {
    weakest_subject: string;
    struggling_with: string;
    reason: string;
  };

  guidance: string;
};

export type ProfileResponse = {
  name: string;
  class: string;
  age: number;
  streak_count: number;
  last_active_date: Date;
};