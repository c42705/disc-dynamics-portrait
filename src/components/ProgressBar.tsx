
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const ProgressBar = ({ currentStep, totalSteps, className }: ProgressBarProps) => {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between text-xs text-muted-foreground mb-2">
        <span>{progress}% Complete</span>
        <span>{currentStep} of {totalSteps}</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
