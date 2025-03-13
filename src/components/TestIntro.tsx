
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TestIntroProps {
  onStart: (userName: string) => void;
  className?: string;
}

const TestIntro = ({ onStart, className }: TestIntroProps) => {
  const [userName, setUserName] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);

  const handleStart = () => {
    if (userName.trim().length < 2) {
      setIsNameValid(false);
      return;
    }
    onStart(userName);
  };

  return (
    <div className={cn("max-w-2xl mx-auto text-center animate-fade-in", className)}>
      <div className="space-y-6 mb-8">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
          Personality Assessment
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Discover Your DISC Personality Profile
        </h1>
        
        <p className="text-muted-foreground text-lg">
          The DISC assessment helps you understand your behavioral style and how you relate to others.
          Complete this short questionnaire to receive your personalized profile.
        </p>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">What You'll Discover</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="flex items-start">
            <div className="bg-disc-dominance/10 p-2 rounded-full mr-3">
              <div className="w-6 h-6 flex items-center justify-center text-disc-dominance font-semibold">D</div>
            </div>
            <div>
              <h3 className="font-medium">Dominance</h3>
              <p className="text-sm text-muted-foreground">How you approach problems and challenges</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-disc-influence/10 p-2 rounded-full mr-3">
              <div className="w-6 h-6 flex items-center justify-center text-disc-influence font-semibold">I</div>
            </div>
            <div>
              <h3 className="font-medium">Influence</h3>
              <p className="text-sm text-muted-foreground">How you interact with and persuade others</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-disc-steadiness/10 p-2 rounded-full mr-3">
              <div className="w-6 h-6 flex items-center justify-center text-disc-steadiness font-semibold">S</div>
            </div>
            <div>
              <h3 className="font-medium">Steadiness</h3>
              <p className="text-sm text-muted-foreground">Your pace and consistency in activities</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-disc-compliance/10 p-2 rounded-full mr-3">
              <div className="w-6 h-6 flex items-center justify-center text-disc-compliance font-semibold">C</div>
            </div>
            <div>
              <h3 className="font-medium">Compliance</h3>
              <p className="text-sm text-muted-foreground">How you respond to rules and procedures</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Ready to Begin?</h2>
        <p className="text-muted-foreground mb-4">Enter your name to receive a personalized certificate.</p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter your full name"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                setIsNameValid(true);
              }}
              className={cn(
                "form-focus",
                !isNameValid && "border-destructive focus:ring-destructive/20"
              )}
            />
            {!isNameValid && (
              <p className="text-destructive text-sm">Please enter your name (minimum 2 characters)</p>
            )}
          </div>
          
          <Button 
            onClick={handleStart}
            className="w-full btn-hover"
            size="lg"
          >
            Start Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestIntro;
