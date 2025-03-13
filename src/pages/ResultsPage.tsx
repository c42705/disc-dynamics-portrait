import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Answer, DiscScore, RelationshipInsight, CertificateData } from '@/types/disc';
import { calculateDiscScores, getRelationshipInsights } from '@/utils/discCalculator';
import { downloadCertificate, formatDate, generateCertificate } from '@/utils/certificateGenerator';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Certificate from '@/components/Certificate';
import { BarChart3, Download, Share2, RefreshCw, Home } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import html2canvas from 'html2canvas';

const ResultsPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [scores, setScores] = useState<DiscScore | null>(null);
  const [insights, setInsights] = useState<RelationshipInsight[]>([]);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  const [activeTab, setActiveTab] = useState('chart');
  const certificateRef = useRef<HTMLDivElement>(null);
  
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
  
  const handleDownloadCertificate = async () => {
    if (!scores || !userName) {
      toast.error("Cannot generate certificate. Data is missing.");
      return;
    }
    
    setIsGeneratingCertificate(true);
    toast("Generating your certificate...");
    
    try {
      const certificateData: CertificateData = {
        userName,
        date: formatDate(new Date()),
        scores,
        insights,
      };
      
      const dataUrl = await generateCertificate(certificateRef, certificateData);
      downloadCertificate(dataUrl, userName);
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error("Failed to generate certificate. Please try again.");
    } finally {
      setIsGeneratingCertificate(false);
    }
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
  
  if (!scores) {
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
  }
  
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
  
  // Create certificate data
  const certificateData: CertificateData = {
    userName,
    date: formatDate(new Date()),
    scores,
    insights,
  };
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-10 animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
          Assessment Results
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Your DISC Profile
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Based on your responses, we've identified your behavioral style. Here's how you relate to others and approach situations.
        </p>
      </div>
      
      <div className="mb-8">
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Your Profile Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Primary Traits</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-10 h-10 rounded-full bg-disc-${primaryTrait.name.toLowerCase()}/10 flex items-center justify-center`}>
                      <span className={`text-disc-${primaryTrait.name.toLowerCase()} font-bold`}>{primaryTrait.name}</span>
                    </div>
                    <div>
                      <div className="font-medium">{insights.find(i => i.dimension.charAt(0) === primaryTrait.name)?.dimension} ({primaryTrait.value}%)</div>
                      <div className="text-sm text-muted-foreground">Primary trait</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <div className={`w-10 h-10 rounded-full bg-disc-${secondaryTrait.name.toLowerCase()}/10 flex items-center justify-center`}>
                      <span className={`text-disc-${secondaryTrait.name.toLowerCase()} font-bold`}>{secondaryTrait.name}</span>
                    </div>
                    <div>
                      <div className="font-medium">{insights.find(i => i.dimension.charAt(0) === secondaryTrait.name)?.dimension} ({secondaryTrait.value}%)</div>
                      <div className="text-sm text-muted-foreground">Secondary trait</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Insight</h3>
                  <p className="text-muted-foreground">
                    {insights.find(i => i.dimension.charAt(0) === primaryTrait.name)?.description}
                  </p>
                </div>
              </div>
              
              <div className="w-full md:w-40% lg:w-1/3">
                <h3 className="text-lg font-medium mb-2 md:text-center">DISC Profile</h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <YAxis dataKey="name" type="category" />
                      <Bar dataKey="value" barSize={30} radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value="chart">
              <BarChart3 className="mr-2 h-4 w-4" />
              DISC Results
            </TabsTrigger>
            <TabsTrigger value="certificate">
              <Download className="mr-2 h-4 w-4" />
              Certificate
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="chart" className="animate-fade-in">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Relationship with Others</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left font-medium">Dimension</th>
                      <th className="py-3 px-4 text-left font-medium">Score</th>
                      <th className="py-3 px-4 text-left font-medium">Relationship with Others</th>
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
        </TabsContent>
        
        <TabsContent value="certificate" className="animate-fade-in">
          <div className="mx-auto max-w-3xl bg-card border rounded-lg p-6 shadow-sm">
            <p className="text-center text-muted-foreground mb-6">
              Here's your personalized DISC certificate. You can download it as a JPEG file to share or keep for your records.
            </p>
            
            <div className="mb-6 relative max-h-[600px] overflow-auto border rounded-lg shadow-sm">
              <Certificate ref={certificateRef} data={certificateData} />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button 
                onClick={handleDownloadCertificate} 
                disabled={isGeneratingCertificate}
                className="btn-hover"
              >
                <Download className="mr-2 h-4 w-4" />
                {isGeneratingCertificate ? 'Generating...' : 'Download Certificate'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleShareResults}
                className="btn-hover"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Results
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="btn-hover"
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleRetakeTest}
          className="btn-hover"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retake Test
        </Button>
      </div>
    </div>
  );
};

export default ResultsPage;
