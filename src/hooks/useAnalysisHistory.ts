import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { AnalysisResult } from '@/hooks/useResumeAnalysis';

export interface AnalysisHistoryItem {
  id: string;
  resume_text: string;
  analysis_result: AnalysisResult;
  created_at: string;
}

export const useAnalysisHistory = () => {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchHistory = useCallback(async () => {
    if (!user) {
      setHistory([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('analysis_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type assertion for JSONB data
      const typedData = (data || []).map(item => ({
        ...item,
        analysis_result: item.analysis_result as unknown as AnalysisResult,
      }));

      setHistory(typedData);
    } catch (err) {
      console.error('Error fetching history:', err);
      toast({
        title: "Error",
        description: "Failed to load analysis history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const saveAnalysis = async (resumeText: string, analysisResult: AnalysisResult) => {
    if (!user) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('analysis_history')
        .insert([{
          user_id: user.id,
          resume_text: resumeText,
          analysis_result: JSON.parse(JSON.stringify(analysisResult)),
        }])
        .select()
        .single();

      if (error) throw error;

      // Refresh history after saving
      await fetchHistory();
      
      toast({
        title: "Saved",
        description: "Analysis saved to your history",
      });

      return data;
    } catch (err) {
      console.error('Error saving analysis:', err);
      toast({
        title: "Error",
        description: "Failed to save analysis to history",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteAnalysis = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('analysis_history')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setHistory(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Deleted",
        description: "Analysis removed from history",
      });

      return true;
    } catch (err) {
      console.error('Error deleting analysis:', err);
      toast({
        title: "Error",
        description: "Failed to delete analysis",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    isLoading,
    saveAnalysis,
    deleteAnalysis,
    refreshHistory: fetchHistory,
  };
};
