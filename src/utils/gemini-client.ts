import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

// Ensure we don't throw during build time if env is missing (for static generation/linting)
const apiKey = GEMINI_API_KEY || "dummy-key-for-build";

export const geminiClient = new GoogleGenAI({ apiKey });
