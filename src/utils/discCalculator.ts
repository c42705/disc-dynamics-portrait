
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

// Define the Question interface
export interface Question {
  id: number;
  text: string;
}

// Function to get DISC questions and initialize answers
export const getDiscQuestions = (): { questions: Question[], answers: Answer[] } => {
  const questions: Question[] = [
    { id: 1, text: 'I am assertive, demanding, and decisive.' },
    { id: 2, text: 'I enjoy doing multiple tasks at once.' },
    { id: 3, text: 'I thrive in a challenge-based environment.' },
    { id: 4, text: 'I think about tasks more than others or myself.' },
    { id: 5, text: 'I am motivated by accomplishment and authority.' },
    
    { id: 6, text: 'I enjoy influencing others to achieve goals.' },
    { id: 7, text: 'I am optimistic about others.' },
    { id: 8, text: 'I prefer to collaborate rather than work alone.' },
    { id: 9, text: 'I use gestures and animated expressions when I communicate.' },
    { id: 10, text: 'I am interested in developing personal connections.' },
    
    { id: 11, text: 'I appreciate predictable situations and environments.' },
    { id: 12, text: 'I listen more than I speak.' },
    { id: 13, text: 'I am patient and supportive of others.' },
    { id: 14, text: 'I prefer to focus on one task until completion.' },
    { id: 15, text: 'I strive for stability and harmony in groups.' },
    
    { id: 16, text: 'I prefer clear rules and instructions to follow.' },
    { id: 17, text: 'I pay careful attention to details and precision.' },
    { id: 18, text: 'I make decisions based on facts and evidence.' },
    { id: 19, text: 'I prefer to work with existing processes rather than creating new ones.' },
    { id: 20, text: 'I analyze situations before making decisions.' }
  ];
  
  // Create initial answers array (all set to 0 value initially)
  const answers: Answer[] = [
    // Dominance questions
    { questionId: 1, type: 'D', value: 0 },
    { questionId: 2, type: 'D', value: 0 },
    { questionId: 3, type: 'D', value: 0 },
    { questionId: 4, type: 'D', value: 0 },
    { questionId: 5, type: 'D', value: 0 },
    
    // Influence questions
    { questionId: 6, type: 'I', value: 0 },
    { questionId: 7, type: 'I', value: 0 },
    { questionId: 8, type: 'I', value: 0 },
    { questionId: 9, type: 'I', value: 0 },
    { questionId: 10, type: 'I', value: 0 },
    
    // Steadiness questions
    { questionId: 11, type: 'S', value: 0 },
    { questionId: 12, type: 'S', value: 0 },
    { questionId: 13, type: 'S', value: 0 },
    { questionId: 14, type: 'S', value: 0 },
    { questionId: 15, type: 'S', value: 0 },
    
    // Compliance questions
    { questionId: 16, type: 'C', value: 0 },
    { questionId: 17, type: 'C', value: 0 },
    { questionId: 18, type: 'C', value: 0 },
    { questionId: 19, type: 'C', value: 0 },
    { questionId: 20, type: 'C', value: 0 }
  ];
  
  return { questions, answers };
};

// Function to get test options
export const getTestOptions = (): { value: number; label: string }[] => {
  return [
    { value: 1, label: 'Strongly Disagree' },
    { value: 2, label: 'Disagree' },
    { value: 3, label: 'Agree' },
    { value: 4, label: 'Strongly Agree' }
  ];
};
