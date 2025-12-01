import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { SplitCodeResult } from "../types";

const processEnvApiKey = process.env.API_KEY;

/**
 * Uses Gemini to intelligently split and refactor code.
 * This is "smarter" than the local splitter because it can:
 * 1. Extract inline styles to the CSS file.
 * 2. Extract inline event handlers (onclick) to the JS file.
 * 3. Fix indentation and formatting.
 */
export const splitCodeWithAI = async (rawCode: string): Promise<SplitCodeResult> => {
  if (!processEnvApiKey) {
    throw new Error("API Key is missing. Please provide a valid API Key to use AI features.");
  }

  const ai = new GoogleGenAI({ apiKey: processEnvApiKey });

  const systemInstruction = `
    You are an expert Frontend Engineer and Code Refactorer.
    Your task is to take a raw string of code (which may be mixed HTML, CSS, and JS) and split it into three distinct, clean files: HTML, CSS, and JavaScript.
    
    Rules:
    1. Extract ALL <style> content into the CSS field. Remove style tags from HTML.
    2. Extract ALL <script> content into the JS field. Remove script tags from HTML.
    3. If there are inline styles (style="..."), attempt to extract them into a CSS class if it makes the code cleaner, otherwise leave them.
    4. Ensure the HTML is a valid body fragment or full document. 
    5. Do not include <!DOCTYPE html> or <html> tags in the HTML output unless the input explicitly had them. Keep it minimal if it was a fragment.
    6. Return valid, formatted code.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `Here is the code to split:\n\n${rawCode}` }],
        },
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            html: { type: Type.STRING, description: "The cleaned HTML code" },
            css: { type: Type.STRING, description: "The extracted CSS code" },
            js: { type: Type.STRING, description: "The extracted JavaScript code" },
          },
          required: ["html", "css", "js"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text);
    return {
      html: result.html || "",
      css: result.css || "",
      js: result.js || "",
    };
  } catch (error) {
    console.error("AI Processing Error:", error);
    throw new Error("Failed to process code with AI. Please try again or use Local Split.");
  }
};