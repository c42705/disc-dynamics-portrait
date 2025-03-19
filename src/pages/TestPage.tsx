import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question as QuestionType, Answer, TestProgress } from '@/types/disc';
import { getDiscQuestions, getTestOptions } from '@/utils/discCalculator';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ProgressBar';
import Question from '@/components/Question';
import TestIntro from '@/components/TestIntro';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TestPage = () => {
  const { t } = useLanguage();
  const [userName, setUserName] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options] = useState(getTestOptions());
  const navigate = useNavigate();

  useEffect(() => {
    const { questions: testQuestions, answers: initialAnswers } = getDiscQuestions();
    setQuestions(testQuestions);
    setAnswers(initialAnswers);
    
    const savedProgress = localStorage.getItem('discTestProgress');
    if (savedProgress) {
      try {
        const progress: TestProgress = JSON.parse(savedProgress);
        setCurrentQuestionIndex(progress.currentQuestionIndex);
        setAnswers(progress.answers);
        
        const savedUserName = localStorage.getItem('discUserName');
        if (savedUserName) {
          setUserName(savedUserName);
          setTestStarted(true);
        }
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (testStarted) {
      const progress: TestProgress = {
        currentQuestionIndex,
        totalQuestions: questions.length,
        answers
      };
      localStorage.setItem('discTestProgress', JSON.stringify(progress));
      localStorage.setItem('discUserName', userName);
    }
  }, [currentQuestionIndex, answers, testStarted, userName, questions.length]);

  const handleStartTest = (name: string) => {
    setUserName(name);
    setTestStarted(true);
    toast(`${t('test.intro.welcome')}, ${name}! ${t('test.intro.lets_discover')}`);
  };

  const handleSelectAnswer = (value: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = {
      ...updatedAnswers[currentQuestionIndex],
      value
    };
    setAnswers(updatedAnswers);
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        handleCompleteTest();
      }
    }, 500);
  };

  const handleNext = () => {
    if (answers[currentQuestionIndex].value === 0) {
      toast.error(t('test.errors.required'));
      return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleCompleteTest();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleCompleteTest = () => {
    const unansweredQuestions = answers.filter(a => a.value === 0);
    
    if (unansweredQuestions.length > 0) {
      toast.error(t('test.errors.required'));
      return;
    }
    
    setTestCompleted(true);
    localStorage.setItem('discTestAnswers', JSON.stringify(answers));
    localStorage.setItem('discUserName', userName);
    
    toast.success(t('test.completion_message'));
    
    navigate('/results');
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  if (!testStarted) {
    return <TestIntro onStart={handleStartTest} />;
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-10 animate-fade-in">
      <div className="mb-10">
        <ProgressBar 
          currentStep={currentQuestionIndex + 1} 
          totalSteps={questions.length}
        />
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            {t('test.question.prefix')} {currentQuestionIndex + 1} {t('test.question.of')} {questions.length}
          </h2>
        </div>
        
        {currentQuestion && (
          <Question
            question={currentQuestion}
            options={options}
            selectedValue={answers[currentQuestionIndex]?.value || 0}
            onSelect={handleSelectAnswer}
          />
        )}
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="btn-hover"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t('test.question.previousButton')}
        </Button>
        
        <Button
          variant={isLastQuestion ? "default" : "default"}
          onClick={handleNext}
          disabled={answers[currentQuestionIndex]?.value === 0}
          className="btn-hover"
        >
          {isLastQuestion ? t('test.question.completeButton') : t('test.question.nextButton')}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TestPage;
