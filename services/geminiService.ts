import { GoogleGenAI } from "@google/genai";

// Initialize the Google Gemini AI client
// The API key MUST be obtained from the environment variable `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Generates a product description using the Gemini AI.
 * @param productName The name of the product.
 * @returns A promise that resolves to the generated description string.
 */
export const generateDescription = async (productName: string): Promise<string> => {
  if (!productName) {
    return "";
  }
  
  try {
    const prompt = `Create a compelling, professional, and concise product description for a digital product named "${productName}". The description should be suitable for an e-commerce store. Focus on the benefits and key features. Keep it under 100 words.`;
    
    // Use the 'gemini-2.5-flash' model for general text tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // Extract text directly from the response object.
    const description = response.text.trim();
    
    return description;

  } catch (error) {
    console.error("Error generating description with Gemini AI:", error);
    // Provide a fallback error message
    return "Failed to generate AI description. Please write one manually.";
  }
};

// FIX: Added 'analyzePaymentProof' function to validate payment receipts using Gemini's multimodal capabilities.
/**
 * Helper to convert a File object to a GoogleGenAI.Part object for multimodal prompts.
 * @param file The file to convert.
 * @returns A promise that resolves to the Part object.
 */
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

/**
 * Analyzes an image of a payment proof to validate it.
 * @param proofImage The image file of the payment proof.
 * @returns A promise that resolves to true if the proof is valid, false otherwise.
 */
export const analyzePaymentProof = async (proofImage: File): Promise<boolean> => {
  if (!proofImage) {
    return false;
  }

  try {
    const imagePart = await fileToGenerativePart(proofImage);
    const textPart = {
      text: "Analyze this image. Is it a valid payment proof for 'PINN STORE'? Look for the text 'PINN STORE' and indicators of a successful transaction. Respond with only 'true' or 'false'.",
    };

    // Use gemini-2.5-flash for multimodal requests
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    const resultText = response.text.trim().toLowerCase();
    return resultText === 'true';

  } catch (error) {
    console.error("Error analyzing payment proof with Gemini AI:", error);
    return false; // Fail safely in case of API error
  }
};
