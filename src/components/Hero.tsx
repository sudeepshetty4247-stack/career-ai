import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Sparkles, TrendingUp, Play } from "lucide-react";

interface HeroProps {
  onAnalyzeClick?: () => void;
  onDemoClick?: () => void;
}

const Hero = ({ onAnalyzeClick, onDemoClick }: HeroProps) => {
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('resume-upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
    onAnalyzeClick?.();
  };

  const handleDemoClick = () => {
    // Scroll to features/stats section to show what the app can do
    const statsSection = document.getElementById('features-section');
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: 'smooth' });
    }
    onDemoClick?.();
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              ML-Powered Career Intelligence
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            Discover Your{" "}
            <span className="text-gradient-primary">Perfect Career</span>
            {" "}Path
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            AI-powered resume analysis with explainable predictions. 
            Understand <span className="text-foreground font-medium">why</span> a career suits you, 
            not just <span className="text-foreground font-medium">what</span> is suggested.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button variant="hero" size="xl" onClick={scrollToUpload}>
              Analyze My Resume
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="glass" size="xl" onClick={handleDemoClick}>
              <Play className="w-5 h-5" />
              See How It Works
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <StatCard 
              icon={Brain}
              value="95%"
              label="Prediction Accuracy"
            />
            <StatCard 
              icon={Sparkles}
              value="100%"
              label="Explainable AI"
            />
            <StatCard 
              icon={TrendingUp}
              value="50+"
              label="Career Domains"
            />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

const StatCard = ({ 
  icon: Icon, 
  value, 
  label 
}: { 
  icon: React.ElementType; 
  value: string; 
  label: string 
}) => (
  <div className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
    <div className="flex items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="text-left">
        <div className="text-3xl font-bold font-display text-gradient-primary">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  </div>
);

export default Hero;
