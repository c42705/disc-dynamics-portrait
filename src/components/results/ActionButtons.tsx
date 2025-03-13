
import { Button } from '@/components/ui/button';
import { Home, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ActionButtonsProps {
  onRetakeTest: () => void;
  onGoHome: () => void;
}

const ActionButtons = ({ onRetakeTest, onGoHome }: ActionButtonsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-center gap-4">
      <Button 
        variant="outline" 
        onClick={onGoHome}
        className="btn-hover"
      >
        <Home className="mr-2 h-4 w-4" />
        {t('results.actions.home')}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onRetakeTest}
        className="btn-hover"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        {t('results.actions.retake')}
      </Button>
    </div>
  );
};

export default ActionButtons;
