import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    // ✅ DUMMY RESPONSE (MATCHES YOUR UI EXPECTATION)
    const dummyAnalysis = {
      skills: [
        { name: "Communication", category: "soft", proficiency: 70 },
        { name: "HR Operations", category: "technical", proficiency: 65 }
      ],
      experience: {
        level: "junior",
        years: 1,
        summary: "Entry-level professional with foundational HR exposure"
      },
      education: {
        degree: "Bachelor's Degree",
        field: "Human Resources",
        institution: "Not specified"
      },
      careerPredictions: [
        {
          domain: "Human Resources",
          probability: 60,
          description: "Strong alignment with HR skills and interests",
          topRoles: ["HR Executive", "HR Coordinator"]
        },
        {
          domain: "Operations",
          probability: 25,
          description: "Process and people handling experience",
          topRoles: ["Operations Analyst"]
        },
        {
          domain: "Administration",
          probability: 15,
          description: "Organizational and communication strengths",
          topRoles: ["Admin Officer"]
        }
      ],
      skillGaps: [
        { skill: "HR Analytics", importance: "high", reason: "Required for modern HR roles" }
      ],
      readinessScore: 62,
      explanation: {
        summary: "Good foundation, needs skill enhancement",
        strengths: ["Communication", "HR Basics"],
        improvements: ["Analytics", "Tools exposure"],
        topContributingFactors: [
          { factor: "HR knowledge", impact: "positive", weight: 30 }
        ]
      },
      roadmap: {
        shortTerm: [{ goal: "Learn Excel & HR tools", duration: "1 month", priority: "high" }],
        midTerm: [{ goal: "HR Analytics course", duration: "3 months", priority: "high" }],
        longTerm: [{ goal: "Professional certification", duration: "6 months", priority: "medium" }]
      }
    };

    return new Response(JSON.stringify(dummyAnalysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
