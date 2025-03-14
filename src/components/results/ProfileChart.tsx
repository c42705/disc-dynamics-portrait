
import { DiscScore } from '@/types/disc';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfileChartProps {
  scores: DiscScore;
}

const ProfileChart = ({ scores }: ProfileChartProps) => {
  const { t } = useLanguage();
  
  // Prepare data for chart
  const chartData = [
    { name: 'D', value: scores.dominance, color: '#3B82F6', fullName: t('results.dimensions.dominance') }, // Blue
    { name: 'I', value: scores.influence, color: '#10B981', fullName: t('results.dimensions.influence') }, // Green
    { name: 'S', value: scores.steadiness, color: '#F59E0B', fullName: t('results.dimensions.steadiness') }, // Amber
    { name: 'C', value: scores.compliance, color: '#6366F1', fullName: t('results.dimensions.compliance') }, // Indigo
  ];
  
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <YAxis 
            dataKey="name" 
            type="category" 
            tickFormatter={(value) => `${value}`}
            tick={{ fill: '#888888' }}
          />
          <Bar 
            dataKey="value" 
            barSize={30} 
            radius={[0, 4, 4, 0]}
            name={t('results.scoreLabel')}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfileChart;
