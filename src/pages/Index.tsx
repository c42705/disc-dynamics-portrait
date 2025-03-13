
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart3, UserCheck, ArrowRight, LightbulbIcon } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 animate-fade-in">
      <div className="container px-4 py-16 sm:py-24 mx-auto max-w-6xl">
        {/* Hero section */}
        <div className="flex flex-col items-center text-center mb-16 space-y-6 pt-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
            Self-Discovery Assessment
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Discover Your <span className="text-primary">DISC</span> Personality Profile
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl">
            Gain insights into your behavioral style and understand how you interact with others.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" asChild className="min-w-40 btn-hover">
              <Link to="/test">
                Take the Test
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Features section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card border rounded-lg p-6 shadow-sm card-hover">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Self-Awareness</h3>
            <p className="text-muted-foreground">
              Gain a deeper understanding of your natural tendencies and behavioral style.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 shadow-sm card-hover">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Detailed Results</h3>
            <p className="text-muted-foreground">
              Receive a comprehensive breakdown of your personality dimensions with visual charts.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 shadow-sm card-hover">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <LightbulbIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Relationship Insights</h3>
            <p className="text-muted-foreground">
              Learn how your behavioral style influences your interactions with others.
            </p>
          </div>
        </div>
        
        {/* DISC explanation */}
        <div className="bg-card border rounded-lg p-8 shadow-sm mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">What is DISC?</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-lg border bg-white/50">
              <div className="flex items-center mb-3">
                <div className="bg-disc-dominance/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-disc-dominance font-bold text-lg">D</span>
                </div>
                <h3 className="font-bold text-lg">Dominance</h3>
              </div>
              <p className="text-muted-foreground">
                How you deal with problems and challenges. People high in Dominance are direct, strong-willed, and forceful.
              </p>
            </div>
            
            <div className="p-4 rounded-lg border bg-white/50">
              <div className="flex items-center mb-3">
                <div className="bg-disc-influence/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-disc-influence font-bold text-lg">I</span>
                </div>
                <h3 className="font-bold text-lg">Influence</h3>
              </div>
              <p className="text-muted-foreground">
                How you interact with and influence others. People high in Influence are sociable, communicative, and optimistic.
              </p>
            </div>
            
            <div className="p-4 rounded-lg border bg-white/50">
              <div className="flex items-center mb-3">
                <div className="bg-disc-steadiness/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-disc-steadiness font-bold text-lg">S</span>
                </div>
                <h3 className="font-bold text-lg">Steadiness</h3>
              </div>
              <p className="text-muted-foreground">
                Your patience, persistence, and thoughtfulness. People high in Steadiness are patient, loyal, and supportive.
              </p>
            </div>
            
            <div className="p-4 rounded-lg border bg-white/50">
              <div className="flex items-center mb-3">
                <div className="bg-disc-compliance/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-disc-compliance font-bold text-lg">C</span>
                </div>
                <h3 className="font-bold text-lg">Compliance</h3>
              </div>
              <p className="text-muted-foreground">
                How you approach rules and procedures. People high in Compliance are careful, precise, and analytical.
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA section */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Learn About Yourself?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Take our free DISC assessment and receive a downloadable certificate with your results.
          </p>
          <Button size="lg" asChild className="btn-hover">
            <Link to="/test">
              Start the Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
