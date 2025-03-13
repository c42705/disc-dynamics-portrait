
import { DiscScore, RelationshipInsight } from '@/types/disc';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResultsSummaryProps {
  userName: string;
  scores: DiscScore;
  insights: RelationshipInsight[];
}

const ResultsSummary = ({ userName, scores, insights }: ResultsSummaryProps) => {
  const { t } = useLanguage();
  
  // Prepare data for chart
  const chartData = [
    { name: 'D', value: scores.dominance, color: '#3B82F6' }, // Blue
    { name: 'I', value: scores.influence, color: '#10B981' }, // Green
    { name: 'S', value: scores.steadiness, color: '#F59E0B' }, // Amber
    { name: 'C', value: scores.compliance, color: '#6366F1' }, // Indigo
  ];
  
  // Find dominant traits (top two)
  const sortedTraits = [...chartData].sort((a, b) => b.value - a.value);
  const primaryTrait = sortedTraits[0];
  const secondaryTrait = sortedTraits[1];
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">{t('results.profileSummary')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">{t('results.primaryTraits')}</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-10 h-10 rounded-full bg-disc-${primaryTrait.name.toLowerCase()}/10 flex items-center justify-center`}>
                  <span className={`text-disc-${primaryTrait.name.toLowerCase()} font-bold`}>{primaryTrait.name}</span>
                </div>
                <div>
                  <div className="font-medium">{insights.find(i => i.dimension.charAt(0) === primaryTrait.name)?.dimension} ({primaryTrait.value}%)</div>
                  <div className="text-sm text-muted-foreground">{t('results.primaryTrait')}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-2">
                <div className={`w-10 h-10 rounded-full bg-disc-${secondaryTrait.name.toLowerCase()}/10 flex items-center justify-center`}>
                  <span className={`text-disc-${secondaryTrait.name.toLowerCase()} font-bold`}>{secondaryTrait.name}</span>
                </div>
                <div>
                  <div className="font-medium">{insights.find(i => i.dimension.charAt(0) === secondaryTrait.name)?.dimension} ({secondaryTrait.value}%)</div>
                  <div className="text-sm text-muted-foreground">{t('results.secondaryTrait')}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">{t('results.keyInsight')}</h3>
              <p className="text-muted-foreground">
                {insights.find(i => i.dimension.charAt(0) === primaryTrait.name)?.description}
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-40% lg:w-1/3">
            <h3 className="text-lg font-medium mb-2 md:text-center">{t('results.discProfile')}</h3>
            <ProfileChart scores={scores} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsSummary;
