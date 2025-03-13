
import { forwardRef } from 'react';
import { CertificateData } from '@/types/disc';
import { formatDate } from '@/utils/certificateGenerator';
import { cn } from '@/lib/utils';

interface CertificateProps {
  data: CertificateData;
  className?: string;
}

const Certificate = forwardRef<HTMLDivElement, CertificateProps>(
  ({ data, className }, ref) => {
    const { userName, date, scores, insights } = data;
    const formattedDate = date || formatDate(new Date());

    // Sort dimensions by score (highest first)
    const sortedInsights = [...insights].sort((a, b) => b.score - a.score);
    
    // Get primary and secondary traits
    const primaryTrait = sortedInsights[0];
    const secondaryTrait = sortedInsights[1];

    // Generate summary based on primary and secondary traits
    const summary = `${primaryTrait.dimension} (${primaryTrait.score}%) and ${secondaryTrait.dimension} (${secondaryTrait.score}%)`;

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden",
          className
        )}
        style={{ aspectRatio: '8.5/11' }}
      >
        {/* Certificate border decoration */}
        <div className="absolute inset-0 border-[12px] border-gray-100 rounded-lg pointer-events-none" />
        
        {/* Certificate content */}
        <div className="relative p-8 h-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight mb-1">DISC Profile Certificate</h1>
            <p className="text-muted-foreground">Personality Assessment Results</p>
          </div>
          
          {/* Certificate seal/emblem */}
          <div className="absolute top-6 right-8 w-20 h-20 opacity-30">
            <div className="w-full h-full rounded-full border-4 border-primary/30 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full border-2 border-primary/30 flex items-center justify-center">
                <div className="text-primary font-mono text-sm">DISC</div>
              </div>
            </div>
          </div>

          {/* Name and date */}
          <div className="mb-8 text-center">
            <p className="text-muted-foreground text-sm mb-1">This certifies that</p>
            <h2 className="text-2xl font-bold text-primary mb-1">{userName}</h2>
            <p className="text-muted-foreground text-sm">Completed the DISC personality assessment on {formattedDate}</p>
          </div>
          
          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Summary */}
            <div className="mb-6 text-center">
              <p className="text-muted-foreground text-sm">Primary personality traits</p>
              <p className="text-lg font-medium">{summary}</p>
            </div>
            
            {/* DISC scores */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-card p-4 rounded-lg border">
                <div className="flex items-center mb-2">
                  <div className="bg-disc-dominance/10 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                    <span className="text-disc-dominance font-medium">D</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Dominance</h3>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div 
                        className="bg-disc-dominance h-2 rounded-full"
                        style={{ width: `${scores.dominance}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-2 text-sm font-medium">{scores.dominance}%</span>
                </div>
              </div>
              
              <div className="bg-card p-4 rounded-lg border">
                <div className="flex items-center mb-2">
                  <div className="bg-disc-influence/10 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                    <span className="text-disc-influence font-medium">I</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Influence</h3>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div 
                        className="bg-disc-influence h-2 rounded-full"
                        style={{ width: `${scores.influence}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-2 text-sm font-medium">{scores.influence}%</span>
                </div>
              </div>
              
              <div className="bg-card p-4 rounded-lg border">
                <div className="flex items-center mb-2">
                  <div className="bg-disc-steadiness/10 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                    <span className="text-disc-steadiness font-medium">S</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Steadiness</h3>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div 
                        className="bg-disc-steadiness h-2 rounded-full"
                        style={{ width: `${scores.steadiness}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-2 text-sm font-medium">{scores.steadiness}%</span>
                </div>
              </div>
              
              <div className="bg-card p-4 rounded-lg border">
                <div className="flex items-center mb-2">
                  <div className="bg-disc-compliance/10 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                    <span className="text-disc-compliance font-medium">C</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Compliance</h3>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div 
                        className="bg-disc-compliance h-2 rounded-full"
                        style={{ width: `${scores.compliance}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-2 text-sm font-medium">{scores.compliance}%</span>
                </div>
              </div>
            </div>
            
            {/* Top insight */}
            <div className="bg-card p-4 rounded-lg border mb-4">
              <h3 className="font-medium mb-2">Key Insight</h3>
              <p className="text-sm text-muted-foreground">{primaryTrait.description}</p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-auto pt-4 border-t text-center text-sm text-muted-foreground">
            <p>This certificate represents results from a self-assessment tool and should be considered in context.</p>
          </div>
        </div>
      </div>
    );
  }
);

Certificate.displayName = 'Certificate';

export default Certificate;
