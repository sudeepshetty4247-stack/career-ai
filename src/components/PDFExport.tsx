import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AnalysisResult } from "@/hooks/useResumeAnalysis";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface PDFExportProps {
  data: AnalysisResult;
}

const PDFExport = ({ data }: PDFExportProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleExport = async () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    setIsExporting(true);

    try {
      // Dynamic import for html2pdf
      const html2pdf = (await import("html2pdf.js")).default;

      // Create a styled HTML content for PDF
      const content = generatePDFContent(data);

      // Create a visible container for proper rendering
      const container = document.createElement("div");
      container.innerHTML = content;
      container.style.position = "fixed";
      container.style.left = "0";
      container.style.top = "0";
      container.style.width = "800px";
      container.style.background = "white";
      container.style.zIndex = "-9999";
      container.style.opacity = "0";
      document.body.appendChild(container);

      // Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 500));

      const opt = {
        margin: [10, 10],
        filename: `CareerAI_Analysis_${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: "#ffffff"
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(container).save();

      document.body.removeChild(container);
    } catch (error) {
      console.error("PDF export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const generatePDFContent = (result: AnalysisResult): string => {
    const topCareer = result.careerPredictions?.[0];

    // Flatten roadmap items for display
    const allRoadmapItems = [
      ...(result.roadmap?.shortTerm?.map(item => ({ ...item, phase: "Short Term" })) || []),
      ...(result.roadmap?.midTerm?.map(item => ({ ...item, phase: "Mid Term" })) || []),
      ...(result.roadmap?.longTerm?.map(item => ({ ...item, phase: "Long Term" })) || []),
    ];

    return `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #6366f1;">
          <h1 style="margin: 0; font-size: 28px; color: #6366f1;">CareerAI Analysis Report</h1>
          <p style="color: #666; margin-top: 8px;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 10px 0;">Career Readiness Score</h2>
          <div style="font-size: 48px; font-weight: bold;">${result.readinessScore || 0}%</div>
        </div>

        ${topCareer ? `
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #6366f1;">
          <h2 style="margin: 0 0 15px 0; color: #1a1a2e;">Top Career Match</h2>
          <h3 style="margin: 0; font-size: 22px; color: #6366f1;">${topCareer.domain}</h3>
          <p style="color: #666; margin: 8px 0;">${topCareer.probability}% probability match</p>
          <p style="margin: 10px 0; color: #333;">${topCareer.description}</p>
          ${topCareer.topRoles?.length ? `
            <div style="margin-top: 10px;">
              <strong>Top Roles:</strong> ${topCareer.topRoles.join(", ")}
            </div>
          ` : ""}
        </div>
        ` : ""}

        <div style="margin-bottom: 20px;">
          <h2 style="color: #1a1a2e; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">All Career Predictions</h2>
          ${result.careerPredictions?.map((career, idx) => `
            <div style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong style="font-size: 16px;">${idx + 1}. ${career.domain}</strong>
                <span style="background: #6366f1; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px;">${career.probability}%</span>
              </div>
              <p style="color: #666; margin: 8px 0 0 0; font-size: 14px;">${career.description}</p>
            </div>
          `).join("") || ""}
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #1a1a2e; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Skills Analysis</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px;">
            ${result.skills?.map(skill => `
              <span style="background: #eef2ff; color: #6366f1; padding: 6px 14px; border-radius: 20px; font-size: 14px;">
                ${skill.name} (${skill.proficiency}%)
              </span>
            `).join("") || ""}
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #1a1a2e; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Skill Gaps to Address</h2>
          ${result.skillGaps?.map((gap, idx) => `
            <div style="padding: 12px; margin: 10px 0; background: #f8fafc; border-radius: 8px; border-left: 4px solid ${gap.importance === 'high' ? '#ef4444' : gap.importance === 'medium' ? '#f59e0b' : '#22c55e'};">
              <strong>${idx + 1}. ${gap.skill}</strong>
              <span style="margin-left: 10px; font-size: 12px; color: ${gap.importance === 'high' ? '#ef4444' : gap.importance === 'medium' ? '#f59e0b' : '#22c55e'};">(${gap.importance} priority)</span>
              <p style="color: #666; margin: 8px 0 0 0;">${gap.reason}</p>
            </div>
          `).join("") || ""}
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #1a1a2e; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Strengths & Improvements</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
            <div>
              <h3 style="color: #22c55e; margin-bottom: 10px;">Strengths</h3>
              <ul style="margin: 0; padding-left: 20px;">
                ${result.explanation?.strengths?.map(s => `<li style="margin: 5px 0;">${s}</li>`).join("") || ""}
              </ul>
            </div>
            <div>
              <h3 style="color: #f59e0b; margin-bottom: 10px;">Areas for Improvement</h3>
              <ul style="margin: 0; padding-left: 20px;">
                ${result.explanation?.improvements?.map(i => `<li style="margin: 5px 0;">${i}</li>`).join("") || ""}
              </ul>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #1a1a2e; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Career Roadmap</h2>
          ${allRoadmapItems.map((item, idx) => `
            <div style="padding: 15px; margin: 10px 0; background: ${idx % 2 === 0 ? "#f8fafc" : "#fff"}; border-left: 4px solid #6366f1; border-radius: 0 8px 8px 0;">
              <div style="display: flex; justify-content: space-between;">
                <strong style="color: #6366f1;">${item.phase}: ${item.goal}</strong>
                <span style="color: #666; font-size: 14px;">${item.duration}</span>
              </div>
              <span style="font-size: 12px; padding: 2px 8px; background: ${item.priority === 'high' ? '#fef2f2' : item.priority === 'medium' ? '#fffbeb' : '#f0fdf4'}; color: ${item.priority === 'high' ? '#ef4444' : item.priority === 'medium' ? '#f59e0b' : '#22c55e'}; border-radius: 4px;">
                ${item.priority} priority
              </span>
            </div>
          `).join("")}
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #666; font-size: 12px;">
          <p style="margin: 0;">Built by Sudesh, Sudeep, Shankar & Vipin</p>
          <p style="margin: 5px 0 0 0;">Career Intelligence System powered by ML & Explainable AI</p>
        </div>
      </div>
    `;
  };

  return (
    <>
      <Button
        onClick={handleExport}
        variant="outline"
        className="gap-2"
        disabled={isExporting}
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileDown className="w-4 h-4" />
        )}
        {isExporting ? "Exporting..." : "Export PDF"}
      </Button>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">Sign In Required</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Please sign in to export your career analysis report as a PDF. This helps us personalize and save your reports.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={() => {
                setShowAuthDialog(false);
                navigate("/auth");
              }}
              className="w-full"
            >
              Sign In / Sign Up
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAuthDialog(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PDFExport;