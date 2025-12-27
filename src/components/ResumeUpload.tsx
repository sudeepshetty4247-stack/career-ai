import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { extractTextFromPDF } from "@/lib/pdfParser";
import { toast } from "sonner";

interface ResumeUploadProps {
  onAnalyze: (resumeText: string) => void;
  isAnalyzing: boolean;
}

const ResumeUpload = ({ onAnalyze, isAnalyzing }: ResumeUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [processingStep, setProcessingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isParsingPDF, setIsParsingPDF] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    // For text files, read directly
    if (file.type === "text/plain") {
      return await file.text();
    }
    
    // For PDF files, use PDF.js
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith('.pdf')) {
      setIsParsingPDF(true);
      try {
        const text = await extractTextFromPDF(file);
        toast.success("PDF parsed successfully!");
        return text;
      } catch (error) {
        toast.error("Failed to parse PDF. Please paste your resume text instead.");
        return "";
      } finally {
        setIsParsingPDF(false);
      }
    }
    
    // For other files (docx, doc), we'll need the user to paste text
    toast.info("For DOCX/DOC files, please copy-paste the content into the text area.");
    return "";
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      
      const text = await extractTextFromFile(droppedFile);
      if (text) {
        setExtractedText(text);
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const text = await extractTextFromFile(selectedFile);
      if (text) {
        setExtractedText(text);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!extractedText.trim()) {
      setError("Please paste your resume content in the text area below");
      return;
    }

    // Animate through processing steps
    setProcessingStep(1);
    await new Promise(r => setTimeout(r, 500));
    setProcessingStep(2);
    await new Promise(r => setTimeout(r, 500));
    setProcessingStep(3);
    await new Promise(r => setTimeout(r, 500));
    setProcessingStep(4);

    onAnalyze(extractedText);
  };

  const handleRemove = () => {
    setFile(null);
    setExtractedText("");
    setProcessingStep(0);
    setError(null);
  };

  return (
    <section id="upload" className="py-24 relative">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Upload Your <span className="text-gradient-primary">Resume</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI will analyze your skills, experience, and education to predict your ideal career path
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div
            className={`
              relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300
              ${dragActive 
                ? "border-primary bg-primary/5 scale-[1.02]" 
                : file 
                  ? "border-primary/50 bg-card" 
                  : "border-border bg-card/50 hover:border-primary/30 hover:bg-card"
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isParsingPDF ? (
              <div className="animate-fade-in">
                <div className="w-20 h-20 rounded-2xl bg-gradient-primary mx-auto mb-6 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
                </div>
                <p className="text-lg font-medium mb-2">Parsing PDF...</p>
                <p className="text-muted-foreground">Extracting text from your resume</p>
              </div>
            ) : file ? (
              <div className="animate-scale-in">
                <div className="w-20 h-20 rounded-2xl bg-gradient-primary mx-auto mb-6 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-lg">{file.name}</span>
                </div>
                <p className="text-muted-foreground mb-6">
                  {(file.size / 1024).toFixed(1)} KB • {extractedText ? "Text extracted successfully" : "Paste resume content below"}
                </p>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 rounded-2xl bg-secondary mx-auto mb-6 flex items-center justify-center">
                  <Upload className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium mb-2">
                  Drag and drop your resume here
                </p>
                <p className="text-muted-foreground mb-2">
                  Supports <span className="text-primary font-medium">PDF</span> and text files
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Or paste your resume content in the text area below
                </p>
                <label>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.txt"
                    onChange={handleFileSelect}
                  />
                  <Button variant="glass" size="lg" asChild>
                    <span className="cursor-pointer">Browse Files</span>
                  </Button>
                </label>
              </>
            )}
          </div>

          {/* Resume text area */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Resume Content <span className="text-primary">*</span>
            </label>
            <textarea
              ref={textareaRef}
              value={extractedText}
              onChange={(e) => {
                setExtractedText(e.target.value);
                setError(null);
              }}
              placeholder="Paste your resume content here... Include your skills, experience, education, and any relevant projects."
              className="w-full h-48 p-4 rounded-xl border border-border bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Tip: Upload a PDF for automatic text extraction, or copy-paste your resume text for best results.
            </p>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-6 flex gap-3 justify-center">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !extractedText.trim() || isParsingPDF}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                "Analyze Resume"
              )}
            </Button>
            {(file || extractedText) && (
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleRemove}
                disabled={isAnalyzing || isParsingPDF}
              >
                Clear
              </Button>
            )}
          </div>

          {/* Processing steps indicator */}
          {isAnalyzing && (
            <div className="mt-8 glass-card rounded-xl p-6 animate-fade-in">
              <div className="space-y-4">
                <ProcessStep step={1} label="Parsing resume structure" active={processingStep >= 1} completed={processingStep > 1} />
                <ProcessStep step={2} label="Extracting skills & experience" active={processingStep >= 2} completed={processingStep > 2} />
                <ProcessStep step={3} label="Running AI prediction model" active={processingStep >= 3} completed={processingStep > 3} />
                <ProcessStep step={4} label="Generating explanations & roadmap" active={processingStep >= 4} completed={false} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ProcessStep = ({ step, label, active = false, completed = false }: { step: number; label: string; active?: boolean; completed?: boolean }) => (
  <div className={`flex items-center gap-4 transition-opacity ${active ? "opacity-100" : "opacity-40"}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
      completed 
        ? "bg-primary text-primary-foreground" 
        : active 
          ? "bg-gradient-primary text-primary-foreground" 
          : "bg-secondary text-muted-foreground"
    }`}>
      {completed ? <CheckCircle2 className="w-4 h-4" /> : step}
    </div>
    <span className={active ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    {active && !completed && <Loader2 className="w-4 h-4 animate-spin text-primary ml-auto" />}
  </div>
);

export default ResumeUpload;
