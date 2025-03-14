
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Answer, DiscScore, RelationshipInsight, CertificateData } from '@/types/disc';
import { calculateDiscScores, getRelationshipInsights } from '@/utils/discCalculator';
import { formatDate } from '@/utils/certificateGenerator';
import { toast } from 'sonner';
import { BarChart3, Download, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { saveResultsToGoogleSheet } from '@/services/googleSheetService';
import { Button } from '@/components/ui/button';

import LoadingSkeleton from '@/components/results/LoadingSkeleton';
import ResultsSummary from '@/components/results/ResultsSummary';
import RelationshipTable from '@/components/results/RelationshipTable';
import CertificateSection from '@/components/results/CertificateSection';
import ActionButtons from '@/components/results/ActionButtons';
import AuthDialog from '@/components/auth/AuthDialog';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { currentUser, isAuthenticated } = useAuth();
  const [userName, setUserName] = useState('');
  const [scores, setScores] = useState<DiscScore | null>(null);
  const [insights, setInsights] = useState<RelationshipInsight[]>([]);
  const [activeTab, setActiveTab] = useState('chart');
  const [isSaving, setIsSaving] = useState(false);
  const [resultsSaved, setResultsSaved] = useState(false);
  
  useEffect(() => {
    // Load test results from localStorage
    const savedAnswers = localStorage.getItem('discTestAnswers');
    const savedUserName = localStorage.getItem('discUserName');
    
    if (!savedAnswers || !savedUserName) {
      toast.error("No test results found. Please take the test first.");
      navigate('/test');
      return;
    }
    
    try {
      const answers = JSON.parse(savedAnswers) as Answer[];
      const calculatedScores = calculateDiscScores(answers);
      const relationshipInsights = getRelationshipInsights(calculatedScores);
      
      setUserName(savedUserName);
      setScores(calculatedScores);
      setInsights(relationshipInsights);
    } catch (error) {
      console.error('Error loading test results:', error);
      toast.error("Error loading your results. Please try taking the test again.");
      navigate('/test');
    }
  }, [navigate]);
  
  const handleRetakeTest = () => {
    // Clear only the answers, keep the userName
    localStorage.removeItem('discTestAnswers');
    localStorage.removeItem('discTestProgress');
    navigate('/test');
  };
  
  const handleShareResults = async () => {
    if (!scores) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My DISC Assessment Results',
          text: `Check out my DISC profile: D: ${scores.dominance}%, I: ${scores.influence}%, S: ${scores.steadiness}%, C: ${scores.compliance}%`,
          url: window.location.href,
        });
        toast.success("Results shared successfully!");
      } catch (error) {
        console.error('Error sharing results:', error);
        toast.error("Failed to share results.");
      }
    } else {
      toast.info("Sharing is not supported on this device or browser.");
    }
  };
  
  const handleSaveToSheet = async () => {
    if (!scores || !userName) {
      toast.error("No results available to save");
      return;
    }
    
    if (!isAuthenticated || !currentUser) {
      toast.error("Please login to save your results");
      return;
    }
    
    setIsSaving(true);
    try {
      const success = await saveResultsToGoogleSheet(
        currentUser.id,
        userName,
        scores,
        language
      );
      
      if (success) {
        setResultsSaved(true);
      }
    } catch (error) {
      console.error('Error saving results:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!scores) {
    return <LoadingSkeleton />;
  }
  
  // Create certificate data
  const certificateData: CertificateData = {
    userName,
    date: formatDate(new Date()),
    scores,
    insights,
  };
  
  const renderSaveButton = () => {
    if (resultsSaved) {
      return (
        <Button variant="outline" disabled className="text-green-500 border-green-500 bg-green-50">
          <Save className="mr-2 h-4 w-4" />
          {t('results.actions.saved')}
        </Button>
      );
    }
    
    if (isAuthenticated) {
      return (
        <Button 
          variant="outline" 
          onClick={handleSaveToSheet} 
          disabled={isSaving}
          className="btn-hover"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? t('common.saving') : t('results.actions.saveToSheet')}
        </Button>
      );
    }
    
    return (
      <AuthDialog 
        trigger={
          <Button variant="outline" className="btn-hover">
            <Save className="mr-2 h-4 w-4" />
            {t('results.actions.loginToSave')}
          </Button>
        } 
      />
    );
  };
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-10 animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
          {t('results.title')}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          {t('results.title')}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('results.summary')}
        </p>
      </div>
      
      <div className="mb-8">
        <ResultsSummary 
          userName={userName} 
          scores={scores} 
          insights={insights} 
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value="chart">
              <BarChart3 className="mr-2 h-4 w-4" />
              {t('results.discProfile')}
            </TabsTrigger>
            <TabsTrigger value="certificate">
              <Download className="mr-2 h-4 w-4" />
              {t('certificate.title')}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="chart" className="animate-fade-in">
          <RelationshipTable insights={insights} />
        </TabsContent>
        
        <TabsContent value="certificate" className="animate-fade-in">
          <CertificateSection 
            certificateData={certificateData} 
            onShareResults={handleShareResults} 
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        {renderSaveButton()}
      </div>
      
      <ActionButtons 
        onRetakeTest={handleRetakeTest} 
        onGoHome={() => navigate('/')} 
      />
    </div>
  );
};

export default ResultsPage;
