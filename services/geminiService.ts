
import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL } from "../constants";
import type { RcaEntry, GeminiResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        source: { type: Type.STRING, enum: ["dataset", "gemini"] },
        confidence: { type: Type.NUMBER },
        matchedId: { type: Type.INTEGER, nullable: true },
        summary: { type: Type.STRING },
        diagnostic_steps: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        corrective_actions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        assumptions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        safety_disclaimer: { type: Type.STRING }
    },
    required: ["source", "confidence", "summary", "diagnostic_steps", "corrective_actions", "assumptions", "safety_disclaimer"]
};


export async function generateRcaResponse(query: string, context: RcaEntry[]): Promise<GeminiResponse> {
    const systemInstruction = `You are an expert Root Cause Analysis (RCA) assistant for the automobile manufacturing industry. Your goal is to help engineers and technicians diagnose and resolve issues with industrial machinery.

Here is a small, trusted dataset of common issues. Use this as your primary source of truth.
<dataset>
${JSON.stringify(context, null, 2)}
</dataset>

Analyze the user's query and follow these rules:
1.  **High-Confidence Match**: First, determine if the user's query is a very close semantic match to any of the 'title' or 'example_user_phrases' in the provided dataset. A high-confidence match requires a clear and unambiguous link to a single entry.
2.  **If High-Confidence Match**: If you find a strong match, your response 'source' MUST be 'dataset'. Set 'confidence' to a value between 0.9 and 1.0. Set 'matchedId' to the ID of the entry. Summarize the entry's 'title', and use its 'recommended_actions' to populate 'diagnostic_steps' and 'corrective_actions'. Do not invent new information.
3.  **If No Match**: If you do not find a high-confidence match, your response 'source' MUST be 'gemini'. Set 'confidence' to a value between 0.5 and 0.8. Set 'matchedId' to null. Perform a detailed root cause analysis based on your own knowledge, using the dataset as context for the types of problems that occur. Provide a concise summary, then list clear, actionable diagnostic steps and corrective actions. Explain your reasoning and list any assumptions made.
4.  **Safety First**: ALWAYS include a relevant safety disclaimer, especially when recommending actions involving high voltage, stored energy (hydraulic/pneumatic), or moving parts. Mention "qualified personnel" and "lockout/tagout" where appropriate.
5.  **JSON Output**: You MUST respond with a single, valid JSON object that adheres to the provided schema. Do not add any text, markdown, or explanations before or after the JSON object.`;


    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [{
                parts: [{
                    text: `User Query: "${query}"`
                }]
            }],
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText) as GeminiResponse;

        // If the source is dataset, find the full entry to pass to the UI
        if (parsedResponse.source === 'dataset' && parsedResponse.matchedId) {
             const matchedEntry = context.find(e => e.id === parsedResponse.matchedId);
             if (matchedEntry) {
                 parsedResponse.fullReportData = matchedEntry;
             }
        }

        return parsedResponse;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to parse response from Gemini. The model may have returned an invalid format.");
    }
}
