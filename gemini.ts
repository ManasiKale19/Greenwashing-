
import { GoogleGenAI } from "@google/genai";
import { AnalysisData } from "../types";

// This simulates the "Greenwashing Analysis Model" using Gemini with Google Search
export const analyzeCompanyWithGemini = async (
  companyName: string,
  textData: string
): Promise<AnalysisData> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!navigator.onLine || !apiKey) {
    console.warn("Device is OFFLINE or No API Key. Using simulation.");
    return simulateAnalysis(companyName, textData);
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemPrompt = `
    You are an Autonomous AI Research, Analysis, and Reporting System designed to evaluate companies based on public data, internal documents, and user/employee reviews.

    Your responsibilities include:
    1. Scraping and understanding external online data (news, blogs, financial reports, ESG reports, press releases, government filings, reviews, etc.) using the googleSearch tool.
    2. Processing internal company documents uploaded by verified users or employees (PDFs, text, forms, logs, policies).
    3. Reading user and employee feedback to identify patterns sentiment and credibility.
    4. Converting raw unstructured data into structured insights, summaries, risk indicators, and scoring models.

    ### 🧠 OUTPUT FORMAT RULES

    Always format your output in the following JSON structure unless instructed otherwise:

    {
      "company_name": "",
      "last_updated": "<current date>",
      "confidence_score": "",

      "external_summary": {
        "key_highlights": [],
        "public_sentiment": "",
        "recent_news_summary": "",
        "possible_bias": ""
      },

      "internal_documents_analysis": {
        "major_findings": [],
        "compliance_risks": [],
        "performance_indicators": [],
        "credibility_score": ""
      },

      "reviews_analysis": {
        "employee_tone": "",
        "customer_tone": "",
        "common_issues": [],
        "overall_sentiment_score": ""
      },

      "risk_assessment": {
        "financial_risk": "",
        "reputation_risk": "",
        "compliance_risk": "",
        "market_risk": "",
        "overall_risk_level": ""
      },

      "opportunities_and_strengths": [],

      "final_company_score": {
        "rating_out_of_100": 0,
        "label": "Excellent / Good / Average / Concerning / Critical"
      },

      "recommended_actions": {
        "for_customers": [],
        "for_employees": [],
        "for_investors": [],
        "for_company_leadership": []
      }
    }

    ### 🧬 SCORING RULES

    Use these guidelines:

    - 0–20: Critical risk, avoid
    - 21–40: Concerning, unstable, unreliable
    - 41–60: Mixed signals, uncertain but possible potential
    - 61–80: Strong, mostly positive with manageable risks
    - 81–100: Excellent, reliable, transparent organization

    ### ⚠️ ETHICAL & SAFETY RULES

    - Never invent data — if uncertain, respond with: "Insufficient information to conclude."
    - Detect propaganda, PR tone, or bias.
    - Highlight missing or suspiciously unavailable information.
    - Treat leaked or illegal private data as unusable.

    ### 🎯 FINAL GOAL

    Your primary goal is to generate a **trustworthy, unbiased, evidence-based evaluation** of a company by merging:

    - Publicly available external data
    - Internally submitted confidential data
    - User/employee sentiment and feedback

    Your tone must remain **professional, neutral, analytical, and data-driven.**
  `;

  const userPrompt = `
    Analyze the company: "${companyName}".
    
    Context / Internal Document Text provided by user:
    "${textData.substring(0, 8000)}"

    Instructions:
    - Use the Google Search tool to find real-time external data, news, and sentiment about ${companyName}.
    - Combine this with the provided internal text.
    - **Reviews Analysis**: You MUST scrape or simulate 50 positive and 50 negative reviews to identify patterns, sentiment, and credibility. Use this balanced dataset to determine the "reviews_analysis" section.
    - Output ONLY valid JSON matching the schema. Do not include markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }],
        // responseSchema is NOT allowed with googleSearch, so we rely on the prompt to enforce JSON
      },
    });

    if (response.text) {
      let cleanText = response.text.trim();
      // Remove potential markdown wrappers
      cleanText = cleanText.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();

      const parsedData = JSON.parse(cleanText) as AnalysisData;

      // Ensure rating is a number
      if (typeof parsedData.final_company_score.rating_out_of_100 === 'string') {
        parsedData.final_company_score.rating_out_of_100 = parseInt(parsedData.final_company_score.rating_out_of_100);
      }

      // Post-process to ensure we have the helper field for UI
      parsedData.greenwashingLabel = (parsedData.final_company_score.rating_out_of_100 < 50 ||
        parsedData.risk_assessment.overall_risk_level.toLowerCase().includes("critical")) ? 1 : 0;

      return parsedData;
    }
    throw new Error("No response text from Gemini");
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return simulateAnalysis(companyName, textData);
  }
};

const simulateAnalysis = (companyName: string, textData: string): AnalysisData => {
  const isGreenwashing = Math.random() > 0.5;

  return {
    company_name: companyName,
    last_updated: new Date().toISOString(),
    confidence_score: "Simulated (Offline Mode)",
    greenwashingLabel: isGreenwashing ? 1 : 0,
    external_summary: {
      key_highlights: ["Simulated data: Mix of positive PR and negative user reports", "Market expansion noted"],
      public_sentiment: isGreenwashing ? "Negative" : "Positive",
      recent_news_summary: "Reports indicate conflicting information regarding sustainability goals.",
      possible_bias: "High corporate PR influence detected."
    },
    internal_documents_analysis: {
      major_findings: ["Document analysis suggests ambitious targets", "Lack of concrete interim milestones"],
      compliance_risks: ["Possible gap in reporting standards", "Data verification missing"],
      performance_indicators: ["Carbon footprint reduced by 2% (Target 10%)"],
      credibility_score: isGreenwashing ? "Low" : "High"
    },
    reviews_analysis: {
      employee_tone: "Mixed",
      customer_tone: isGreenwashing ? "Skeptical" : "Loyal",
      common_issues: ["Product durability", "Transparency"],
      overall_sentiment_score: isGreenwashing ? "40/100" : "85/100"
    },
    risk_assessment: {
      financial_risk: "Medium",
      reputation_risk: isGreenwashing ? "High" : "Low",
      compliance_risk: "Medium",
      market_risk: "Low",
      overall_risk_level: isGreenwashing ? "Concerning" : "Stable"
    },
    opportunities_and_strengths: ["Strong R&D", "Global presence"],
    final_company_score: {
      rating_out_of_100: isGreenwashing ? 35 : 85,
      label: isGreenwashing ? "Concerning" : "Excellent"
    },
    recommended_actions: {
      for_customers: ["Verify claims independently"],
      for_employees: ["Internal feedback"],
      for_investors: ["ESG Audit"],
      for_company_leadership: ["Improve transparency"]
    }
  };
};