import { Lightbulb, Code, GraduationCap, Briefcase, Zap, TrendingUp, TrendingDown } from "lucide-react";
import { AnalysisResult } from "@/hooks/useResumeAnalysis";

interface ExplainableAIProps {
  data: AnalysisResult;
}

const factorIcons: Record<string, typeof Code> = {
  technical: Code,
  education: GraduationCap,
  experience: Briefcase,
  default: Zap,
};

const factorColors = [
  "from-cyan-400 to-cyan-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-violet-400 to-violet-600",
];

const ExplainableAI = ({ data }: ExplainableAIProps) => {
  const { explanation, careerPredictions } = data;
  const topPrediction = careerPredictions[0];
  const factors = explanation?.topContributingFactors || [];

  return (
    <section id="explainability" className="py-24 relative">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Lightbulb className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Explainable AI Engine
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-primary">Why</span> This Career?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transparent AI that explains every decision. No black boxes – understand exactly what drives your career prediction.
            </p>
          </div>

          {/* Decision factors */}
          <div className="grid gap-6 mb-12">
            {factors.map((item, index) => {
              const IconComponent = factorIcons.default;
              return (
                <div 
                  key={item.factor}
                  className="glass-card rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${factorColors[index % factorColors.length]} flex items-center justify-center flex-shrink-0`}>
                      {item.impact === "positive" ? (
                        <TrendingUp className="w-8 h-8 text-primary-foreground" />
                      ) : (
                        <TrendingDown className="w-8 h-8 text-primary-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-display text-xl font-bold">{item.factor}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.impact === "positive" 
                            ? "bg-primary/10 text-primary" 
                            : "bg-destructive/10 text-destructive"
                        }`}>
                          {item.impact === "positive" ? "Positive Impact" : "Needs Improvement"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-display text-3xl font-bold ${
                        item.impact === "positive" ? "text-gradient-primary" : "text-accent"
                      }`}>
                        {item.impact === "positive" ? "+" : ""}{item.weight}%
                      </span>
                      <p className="text-sm text-muted-foreground">Weight</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {factors.length === 0 && (
              <div className="glass-card rounded-2xl p-8 text-center">
                <p className="text-muted-foreground">
                  Factor analysis will appear here after the AI processes your resume.
                </p>
              </div>
            )}
          </div>

          {/* Confidence breakdown */}
          <div className="glass-card rounded-3xl p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">Confidence Breakdown</h3>
                <p className="text-sm text-muted-foreground">How certain is this prediction?</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 rounded-2xl bg-secondary/50">
                <div className="font-display text-4xl font-bold text-gradient-primary mb-2">
                  {topPrediction?.probability || 0}%
                </div>
                <p className="text-sm text-muted-foreground">Model Confidence</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-secondary/50">
                <div className="font-display text-4xl font-bold mb-2">
                  {data.skills.length >= 5 ? "High" : data.skills.length >= 3 ? "Medium" : "Low"}
                </div>
                <p className="text-sm text-muted-foreground">Data Quality</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-secondary/50">
                <div className="font-display text-4xl font-bold mb-2">
                  {factors.filter(f => f.impact === "positive").length}/{factors.length}
                </div>
                <p className="text-sm text-muted-foreground">Factors Aligned</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-primary">AI Explanation:</span>{" "}
                {explanation?.summary || 
                  `Your prediction is based on a weighted analysis of ${factors.length} key factors. 
                  The model identified alignment between your skills and ${topPrediction?.domain || "your target domain"} requirements.`
                }
              </p>
            </div>

            {/* Strengths and Improvements */}
            {(explanation?.strengths?.length > 0 || explanation?.improvements?.length > 0) && (
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {explanation?.strengths?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-primary mb-3">Key Strengths</h4>
                    <ul className="space-y-2">
                      {explanation.strengths.map((strength, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {explanation?.improvements?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-accent mb-3">Areas for Improvement</h4>
                    <ul className="space-y-2">
                      {explanation.improvements.map((improvement, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <TrendingDown className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExplainableAI;
