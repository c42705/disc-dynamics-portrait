
import { Answer, DiscScore, RelationshipInsight } from '../types/disc';

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

  // Calculate percentage (assuming 5 questions per dimension with max score of 4 per question)
  const maxPossible = 5 * 4; // 5 questions × 4 points max
  
  return {
    dominance: Math.round((dScore / maxPossible) * 100),
    influence: Math.round((iScore / maxPossible) * 100),
    steadiness: Math.round((sScore / maxPossible) * 100),
    compliance: Math.round((cScore / maxPossible) * 100),
  };
};

export const getRelationshipInsights = (scores: DiscScore): RelationshipInsight[] => {
  const insights: RelationshipInsight[] = [
    {
      dimension: 'Dominance',
      score: scores.dominance,
      description: scores.dominance > 50 
        ? 'You prefer direct communication and taking control in relationships. You may come across as assertive and results-oriented to others.'
        : 'You tend to be accommodating and cooperative in relationships. You may prefer collaboration over competition.'
    },
    {
      dimension: 'Influence',
      score: scores.influence,
      description: scores.influence > 50 
        ? 'You enjoy social interactions and building enthusiastic relationships. Others likely see you as outgoing and persuasive.'
        : 'You tend to be more reserved in social situations and prefer deep, meaningful connections over casual interactions.'
    },
    {
      dimension: 'Steadiness',
      score: scores.steadiness,
      description: scores.steadiness > 50 
        ? 'You value stability and consistency in relationships. You likely come across as patient, loyal, and supportive to others.'
        : 'You adapt quickly to change and may prefer variety in relationships. Others might see you as flexible but possibly restless.'
    },
    {
      dimension: 'Compliance',
      score: scores.compliance,
      description: scores.compliance > 50 
        ? 'You appreciate structure and accuracy in interactions. Others likely view you as detail-oriented, analytical, and conscientious.'
        : 'You tend to be more spontaneous and flexible with rules. You might be seen as informal or unconventional in your approach.'
    }
  ];

  return insights;
};

export const getDiscQuestions = (): { questions: Question[], answers: Answer[] } => {
  // Define sample questions
  const questions = [
    { id: 1, text: "I prefer taking the lead in group situations." },
    { id: 2, text: "I enjoy being the center of attention in social gatherings." },
    { id: 3, text: "I prefer stable, predictable environments." },
    { id: 4, text: "I pay close attention to details and accuracy." },
    { id: 5, text: "I make decisions quickly and confidently." },
    { id: 6, text: "I am optimistic and enthusiastic about new ideas." },
    { id: 7, text: "I am patient and supportive of others." },
    { id: 8, text: "I follow rules and established procedures closely." },
    { id: 9, text: "I am comfortable with conflict and confrontation." },
    { id: 10, text: "I express my emotions openly and easily." },
    { id: 11, text: "I prefer working at a steady, methodical pace." },
    { id: 12, text: "I am analytical and cautious when making decisions." },
    { id: 13, text: "I am competitive and results-oriented." },
    { id: 14, text: "I enjoy collaborating and working with others." },
    { id: 15, text: "I value harmony and avoid sudden changes." },
    { id: 16, text: "I prioritize accuracy and logical thinking." },
    { id: 17, text: "I am direct and straightforward in communication." },
    { id: 18, text: "I am persuasive and can inspire others easily." },
    { id: 19, text: "I am a good listener and loyal friend." },
    { id: 20, text: "I set high standards for myself and others." }
  ];

  // Pre-define question types
  const answerTypes = [
    { id: 1, type: 'D' }, { id: 2, type: 'I' }, { id: 3, type: 'S' }, { id: 4, type: 'C' },
    { id: 5, type: 'D' }, { id: 6, type: 'I' }, { id: 7, type: 'S' }, { id: 8, type: 'C' },
    { id: 9, type: 'D' }, { id: 10, type: 'I' }, { id: 11, type: 'S' }, { id: 12, type: 'C' },
    { id: 13, type: 'D' }, { id: 14, type: 'I' }, { id: 15, type: 'S' }, { id: 16, type: 'C' },
    { id: 17, type: 'D' }, { id: 18, type: 'I' }, { id: 19, type: 'S' }, { id: 20, type: 'C' }
  ];

  // Initialize empty answers
  const answers = questions.map(q => ({
    questionId: q.id,
    value: 0,
    type: answerTypes.find(a => a.id === q.id)?.type as 'D' | 'I' | 'S' | 'C'
  }));

  return { questions, answers };
};

export interface Question {
  id: number;
  text: string;
}

export const getTestOptions = (): { value: number; label: string }[] => {
  return [
    { value: 1, label: "Strongly Disagree" },
    { value: 2, label: "Disagree" },
    { value: 3, label: "Agree" },
    { value: 4, label: "Strongly Agree" }
  ];
};
