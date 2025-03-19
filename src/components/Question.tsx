
import { useState, useEffect } from 'react';
import { Option, Question as QuestionType } from '@/types/disc';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuestionProps {
  question: QuestionType;
  options: Option[];
  selectedValue: number;
  onSelect: (value: number) => void;
  className?: string;
}

const Question = ({ question, options, selectedValue, onSelect, className }: QuestionProps) => {
  const { t } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<number>(selectedValue);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setSelectedOption(selectedValue);
    
    // Reset animation state when question changes
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    
    return () => clearTimeout(timer);
  }, [question.id, selectedValue]);

  const handleSelect = (value: number) => {
    setSelectedOption(value);
    onSelect(value);
  };
  
  // Translate option labels
  const translateOption = (option: Option) => {
    const key = option.label.toLowerCase().replace(/\s+/g, '_');
    const translationKey = `test.options.${key}`;
    return t(translationKey) || option.label;
  };

  return (
    <div className={cn(
      "w-full animate-fade-in transition-opacity duration-300",
      isAnimating ? "opacity-0" : "opacity-100",
      className
    )}>
      <div className="mb-6">
        <h3 className="text-lg font-medium">{question.text}</h3>
      </div>
      
      <div className="space-y-2">
        {options.map((option) => (
          <div 
            key={option.value}
            className={cn(
              "relative flex items-center p-4 rounded-md border transition-all duration-200 cursor-pointer",
              selectedOption === option.value 
                ? "border-primary bg-primary/5 shadow-sm" 
                : "border-border hover:border-primary/30 hover:bg-secondary/50"
            )}
            onClick={() => handleSelect(option.value)}
          >
            <div className={cn(
              "h-5 w-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200",
              selectedOption === option.value 
                ? "border-primary" 
                : "border-muted-foreground/30"
            )}>
              {selectedOption === option.value && (
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              )}
            </div>
            
            <span className={cn(
              "text-sm transition-colors",
              selectedOption === option.value 
                ? "text-foreground font-medium" 
                : "text-muted-foreground"
            )}>
              {translateOption(option)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
