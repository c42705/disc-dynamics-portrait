
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface TestResult {
  id: string;
  date: string;
  scores: {
    dominance: number;
    influence: number;
    steadiness: number;
    compliance: number;
  };
}

// Mock history data (in a real app, this would come from a database)
const mockTestHistory: TestResult[] = [
  {
    id: '1',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    scores: {
      dominance: 70,
      influence: 45,
      steadiness: 30,
      compliance: 55
    }
  },
  {
    id: '2',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    scores: {
      dominance: 60,
      influence: 55,
      steadiness: 40,
      compliance: 45
    }
  }
];

const HistoryPage = () => {
  const { t } = useLanguage();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error(t('auth.sessionExpired'));
      navigate('/');
      return;
    }
    
    // Simulate loading test history (would be an API call in a real app)
    const loadTestHistory = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTestHistory(mockTestHistory);
      } catch (error) {
        console.error('Error loading test history:', error);
        toast.error(t('history.errors.loadFailed'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTestHistory();
  }, [isAuthenticated, navigate, t]);
  
  const handleViewResult = (resultId: string) => {
    // In a real app, this would navigate to the result detail page
    toast.info(`Viewing result ${resultId}`);
  };
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          {t('history.title')}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('history.subtitle')}
        </p>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="h-28 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : testHistory.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">{t('history.noResults')}</p>
            <Button onClick={() => navigate('/test')}>
              {t('history.takeTestButton')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {testHistory.map((result) => (
            <Card key={result.id} className="hover:bg-muted/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{t('history.testDate')}: {result.date}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => handleViewResult(result.id)}>
                    {t('history.viewButton')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-disc-dominance">{result.scores.dominance}%</div>
                    <div className="text-xs text-muted-foreground">{t('results.dimensions.dominance')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-disc-influence">{result.scores.influence}%</div>
                    <div className="text-xs text-muted-foreground">{t('results.dimensions.influence')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-disc-steadiness">{result.scores.steadiness}%</div>
                    <div className="text-xs text-muted-foreground">{t('results.dimensions.steadiness')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-disc-compliance">{result.scores.compliance}%</div>
                    <div className="text-xs text-muted-foreground">{t('results.dimensions.compliance')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-8 flex justify-center">
        <Button variant="outline" onClick={() => navigate('/')}>
          {t('common.backToHome')}
        </Button>
      </div>
    </div>
  );
};

export default HistoryPage;
