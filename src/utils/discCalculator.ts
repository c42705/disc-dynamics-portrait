
import { Answer, DiscScore, RelationshipInsight } from '../types/disc';

// Adjusted calculation with proper percentile handling
export const calculateDiscScores = (answers: Answer[]): DiscScore => {
  // Calculate raw scores
  const dAnswers = answers.filter(a => a.type === 'D');
  const iAnswers = answers.filter(a => a.type === 'I');
  const sAnswers = answers.filter(a => a.type === 'S');
  const cAnswers = answers.filter(a => a.type === 'C');

  // Sum scores for each dimension
  const dScore = dAnswers.reduce((sum, answer) => sum + answer.value, 0);
  const iScore = iAnswers.reduce((sum, answer) => sum + answer.value, 0);
  const sScore = sAnswers.reduce((sum, answer) => sum + answer.value, 0);
  const cScore = cAnswers.reduce((sum, answer) => sum + answer.value, 0);

  // Adjusted calculation based on actual possible range (5-20 points per dimension)
  const minPossible = 5;  // 5 questions × 1 point (minimum)
  const maxPossible = 20; // 5 questions × 4 points (maximum)
  const range = maxPossible - minPossible;

  return {
    dominance: Math.round(((dScore - minPossible) / range) * 100),
    influence: Math.round(((iScore - minPossible) / range) * 100),
    steadiness: Math.round(((sScore - minPossible) / range) * 100),
    compliance: Math.round(((cScore - minPossible) / range) * 100),
  };
};

// Updated insights with DISC-specific interpretation ranges
export const getRelationshipInsights = (scores: DiscScore): RelationshipInsight[] => {
  const insights: RelationshipInsight[] = [
    {
      dimension: 'Dominance',
      score: scores.dominance,
      description: getDominanceDescription(scores.dominance)
    },
    {
      dimension: 'Influence',
      score: scores.influence,
      description: getInfluenceDescription(scores.influence)
    },
    {
      dimension: 'Steadiness',
      score: scores.steadiness,
      description: getSteadinessDescription(scores.steadiness)
    },
    {
      dimension: 'Compliance',
      score: scores.compliance,
      description: getComplianceDescription(scores.compliance)
    }
  ];

  return insights;
};

// DISC-specific description logic
const getDominanceDescription = (score: number): string => {
  if (score >= 70) return 'Strong preference for leadership and challenge-seeking behavior';
  if (score >= 40) return 'Moderate preference for direct communication and control';
  return 'Preference for collaborative approaches and risk-averse behavior';
};

const getInfluenceDescription = (score: number): string => {
  if (score >= 70) return 'Highly sociable and persuasive communication style';
  if (score >= 40) return 'Balanced approach between social interaction and reflection';
  return 'Preference for deep, meaningful connections over casual interactions';
};

const getSteadinessDescription = (score: number): string => {
  if (score >= 70) return 'Strong preference for stability and predictable environments';
  if (score >= 40) return 'Balanced approach between consistency and adaptability';
  return 'Comfortable with change and flexible in approach';
};

const getComplianceDescription = (score: number): string => {
  if (score >= 70) return 'Strong focus on accuracy and systematic approaches';
  if (score >= 40) return 'Balanced between rule-following and flexibility';
  return 'Preference for informal approaches and spontaneous decisions';
};

// Rest of the file remains the same as your original implementation
export const getDiscQuestions = (): { questions: Question[], answers: Answer[] } => {
  // ... (same as original)
};

export interface Question {
  id: number;
  text: string;
}

export const getTestOptions = (): { value: number; label: string }[] => {
  // ... (same as original)
};
