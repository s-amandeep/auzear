export type TeachingInput = {
  topic: string;
  classLevel: string;
};

export type QuestionResponse = {
  questions: string[];
};

export type FeedbackInput = {
  topic: string;
  classLevel: string;
  score: number
};