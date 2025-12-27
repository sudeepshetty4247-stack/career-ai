import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `
You are an expert career counselor and resume analyst.

Analyze the given resume text carefully and respond ONLY with valid JSON
in the exact schema below. Do not add explanations outside JSON.

Rules:
- Use resume content to determine skills, domain, scores
- Different resumes MUST produce different results
- Probabilities must sum to 100
- Be realistic (no exaggeration)

JSON schema:
{
  "skills": [
    {"name": "Skill", "category": "technical|soft", "proficiency": number}
  ],
  "experience": {
    "level": "fresher|junior|mid|senior",
    "years": number,
    "summary": "string"
  },
  "education": {
    "degree": "string",
    "field": "string",
    "institution": "string"
  },
  "careerPredictions": [
    {
      "domain": "string",
      "probability": number,
      "description": "string",
      "topRoles": ["string"]
    }
  ],
  "skillGaps": [
    {"skill": "string", "importance": "low|medium|high", "reason": "string"}
  ],
  "readinessScore": number,
  "explanation": {
    "summary": "string",
    "strengths": ["string"],
    "improvements": ["string"],
    "topContributingFactors": [
      {"factor": "string", "impact": "positive|negative", "weight": number}
    ]
  },
  "roadmap": {
    "shortTerm": [{"goal": "string", "duration": "string", "priority": "high|medium|low"}],
    "midTerm": [{"goal": "string", "duration": "string", "priority": "high|medium|low"}],
    "longTerm": [{"goal": "string", "duration": "string", "priority": "high|medium|low"}]
  }
}
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText } = await req.json();

    if (!resumeText || resumeText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Resume text is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const HF_API_KEY = Deno.env.get("HF_API_KEY");
    if (!HF_API_KEY) {
      throw new Error("HF_API_KEY not configured");
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `${systemPrompt}\n\nRESUME:\n${resumeText}`,
          options: { wait_for_model: true },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Hugging Face error:", err);
      throw new Error("Hugging Face API failed");
    }

    const data = await response.json();

    // Hugging Face returns text output
    const outputText =
      data?.[0]?.generated_text ||
      data?.generated_text ||
      JSON.stringify(data);

    // Extract JSON safely
    let jsonText = outputText;
    const match = outputText.match(/```json([\s\S]*?)```/);
    if (match) {
      jsonText = match[1].trim();
    }

    const analysis = JSON.parse(jsonText);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("analyze-resume error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
