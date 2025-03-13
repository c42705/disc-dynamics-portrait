
import { RelationshipInsight } from '@/types/disc';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface RelationshipTableProps {
  insights: RelationshipInsight[];
}

const RelationshipTable = ({ insights }: RelationshipTableProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{t('results.relationshipWithOthers')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left font-medium">{t('results.dimension')}</th>
                <th className="py-3 px-4 text-left font-medium">{t('results.score')}</th>
                <th className="py-3 px-4 text-left font-medium">{t('results.relationship')}</th>
              </tr>
            </thead>
            <tbody>
              {insights.map((insight, index) => (
                <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full bg-disc-${insight.dimension.charAt(0).toLowerCase()}/10 flex items-center justify-center mr-2`}>
                        <span className={`text-disc-${insight.dimension.charAt(0).toLowerCase()} font-medium`}>{insight.dimension.charAt(0)}</span>
                      </div>
                      <span className="font-medium">{insight.dimension}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-full max-w-[100px] bg-muted h-2 rounded-full mr-2">
                        <div 
                          className={`bg-disc-${insight.dimension.charAt(0).toLowerCase()} h-2 rounded-full`}
                          style={{ width: `${insight.score}%` }}
                        />
                      </div>
                      <span>{insight.score}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {insight.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelationshipTable;
