import { CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AnalysisResult } from "@/hooks/useResumeAnalysis";

interface SkillAnalysisProps {
  data: AnalysisResult;
}

const SkillAnalysis = ({ data }: SkillAnalysisProps) => {
  const strongSkills = data.skills.filter(s => s.proficiency >= 60);
  const gapSkills = data.skillGaps || [];
  const readinessScore = data.readinessScore || 0;

  const getReadinessLabel = (score: number) => {
    if (score >= 80) return "High Readiness";
    if (score >= 60) return "Moderate Readiness";
    if (score >= 40) return "Building Readiness";
    return "Early Stage";
  };

  return (
    <section id="skills" className="py-24 relative bg-card/30">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Skill <span className="text-gradient-primary">Analysis</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Detailed breakdown of your skills and their contribution to career predictions
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Strengths */}
            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-success flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">Your Strengths</h3>
                  <p className="text-sm text-muted-foreground">{strongSkills.length} skills identified</p>
                </div>
              </div>

              <div className="space-y-5">
                {strongSkills.slice(0, 5).map((skill, index) => (
                  <div 
                    key={skill.name}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-primary flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3" />
                          {skill.category}
                        </span>
                        <span className="text-muted-foreground">{skill.proficiency}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-success rounded-full progress-animate"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                ))}
                {strongSkills.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No strong skills detected yet. Keep building your expertise!
                  </p>
                )}
              </div>
            </div>

            {/* Gaps */}
            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">Skill Gaps</h3>
                  <p className="text-sm text-muted-foreground">Areas to improve for career growth</p>
                </div>
              </div>

              <div className="space-y-5">
                {gapSkills.slice(0, 4).map((gap, index) => (
                  <div 
                    key={gap.skill}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{gap.skill}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm px-2 py-0.5 rounded-full ${
                          gap.importance === "high" 
                            ? "bg-destructive/10 text-destructive" 
                            : gap.importance === "medium"
                              ? "bg-accent/20 text-accent"
                              : "bg-secondary text-muted-foreground"
                        }`}>
                          {gap.importance}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {gap.reason}
                    </p>
                  </div>
                ))}
                {gapSkills.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No significant skill gaps identified. Great job!
                  </p>
                )}
              </div>

              {gapSkills.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    💡 <span className="text-foreground font-medium">Tip:</span> Focus on{" "}
                    {gapSkills.find(g => g.importance === "high")?.skill || gapSkills[0]?.skill || "key skills"}{" "}
                    first - it will have the biggest impact on your career readiness.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Readiness Score */}
          <div className="mt-8 glass-card rounded-3xl p-8 text-center">
            <h3 className="font-display text-xl font-bold mb-4">Career Readiness Score</h3>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="hsl(var(--secondary))"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#readinessGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${readinessScore * 3.52} 352`}
                  />
                  <defs>
                    <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(174 72% 56%)" />
                      <stop offset="100%" stopColor="hsl(166 72% 50%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-3xl font-bold">{readinessScore}%</span>
                </div>
              </div>
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                  {getReadinessLabel(readinessScore)}
                </div>
                <p className="text-muted-foreground max-w-xs">
                  {readinessScore >= 70 
                    ? "You're well-prepared for your target career! Focus on specialization."
                    : `You're on the right track! Improve skill gaps to increase your readiness to ${Math.min(readinessScore + 20, 100)}%+`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillAnalysis;
