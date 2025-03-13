
import { BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LoadingSkeleton = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-3xl mx-auto px-4 py-10 text-center">
      <div className="animate-pulse flex flex-col items-center justify-center">
        <div className="h-32 w-32 bg-secondary rounded-full mb-4 flex items-center justify-center">
          <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
        </div>
        <div className="h-8 bg-secondary rounded w-64 mb-4"></div>
        <div className="h-4 bg-secondary rounded w-40 mb-8"></div>
        <Button variant="outline" onClick={() => navigate('/test')}>
          Take the Test
        </Button>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
