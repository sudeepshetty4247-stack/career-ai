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

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: systemPrompt },
                { text: `RESUME:\n${resumeText}` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const err = await geminiResponse.text();
      console.error("Gemini error:", err);
      throw new Error("Gemini API failed");
    }

    const data = await geminiResponse.json();

    const content =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error("Empty Gemini response");
    }

    // Extract JSON safely (handles ```json blocks)
    let jsonText = content;
    const match = content.match(/```json([\s\S]*?)```/);
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
