import { useState } from "react";
import { useAnalysisHistory, AnalysisHistoryItem } from "@/hooks/useAnalysisHistory";
import { AnalysisResult } from "@/hooks/useResumeAnalysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Trash2, Eye, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AnalysisHistoryProps {
  onLoadAnalysis: (result: AnalysisResult) => void;
}

const AnalysisHistory = ({ onLoadAnalysis }: AnalysisHistoryProps) => {
  const { history, isLoading, deleteAnalysis } = useAnalysisHistory();
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (history.length === 0) {
    return null;
  }

  const displayedHistory = isExpanded ? history : history.slice(0, 3);

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <History className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold">Your Analysis History</h2>
          </div>

          <div className="grid gap-4">
            {displayedHistory.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
                onLoad={() => onLoadAnalysis(item.analysis_result)}
                onDelete={() => deleteAnalysis(item.id)}
              />
            ))}
          </div>

          {history.length > 3 && (
            <Button
              variant="ghost"
              className="mt-4 w-full"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show All ({history.length} analyses)
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

interface HistoryCardProps {
  item: AnalysisHistoryItem;
  onLoad: () => void;
  onDelete: () => void;
}

const HistoryCard = ({ item, onLoad, onDelete }: HistoryCardProps) => {
  const topDomain = item.analysis_result.careerPredictions?.[0]?.domain || "Career Analysis";
  const score = item.analysis_result.readinessScore || 0;
  const date = format(new Date(item.created_at), "MMM d, yyyy 'at' h:mm a");

  return (
    <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">
              {topDomain}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{date}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">{score}%</span>
              <p className="text-xs text-muted-foreground">Readiness</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 flex-wrap">
          {item.analysis_result.skills?.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
            >
              {skill.name}
            </span>
          ))}
          {item.analysis_result.skills?.length > 4 && (
            <span className="text-xs text-muted-foreground">
              +{item.analysis_result.skills.length - 4} more
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button
            variant="default"
            size="sm"
            onClick={onLoad}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            View Analysis
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Analysis?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove this analysis from your history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisHistory;
