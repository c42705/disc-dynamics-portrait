
export interface Question {
  id: number;
  text: string;
}

export interface Option {
  value: number;
  label: string;
}

export interface Answer {
  questionId: number;
  value: number; // 1-4 scale
  type: 'D' | 'I' | 'S' | 'C';
}

export interface DiscScore {
  dominance: number;
  influence: number;
  steadiness: number;
  compliance: number;
}

export interface RelationshipInsight {
  dimension: 'Dominance' | 'Influence' | 'Steadiness' | 'Compliance';
  score: number;
  description: string;
}

export interface TestProgress {
  currentQuestionIndex: number;
  totalQuestions: number;
  answers: Answer[];
}

export interface CertificateData {
  userName: string;
  date: string;
  scores: DiscScore;
  insights: RelationshipInsight[];
}
