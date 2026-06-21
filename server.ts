import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI client with correct telemetry User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.use(express.json());

// API route for motion graphics asset generation
app.post("/api/generate-motion", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required and must be a string." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY environment variable is not configured. Please add it via Settings > Secrets." 
      });
    }

    const systemInstruction = 
      "You are a futuristic motion graphics director. Your task is to translate a creative text prompt " +
      "into specific, functional parameter variables for a WebGL kinetic 3D engine. " +
      "Generate clean JSON output describing the motion graphics video template. " +
      "Select the category and proceduralType that fits best. baseSpeed should be between 0.4 and 2.5. " +
      "Format should be one of formatting limits: 'MP4' | 'MOV' | 'WEBM' | 'GIF' | 'Lottie JSON'. " +
      "Resolution should be one of: '720p' | '1080p' | '2K' | '4K' | '8K'.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Prompt: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "title",
            "description",
            "category",
            "tags",
            "fileFormat",
            "resolution",
            "proceduralType",
            "color",
            "secondaryColor",
            "baseSpeed"
          ],
          properties: {
            title: {
              type: Type.STRING,
              description: "A punchy, cinematic, futuristic title for the motion graphics asset, e.g. 'Stardust Nebula Swirl'",
            },
            description: {
              type: Type.STRING,
              description: "A detailed professional motion design review explaining what the visual does and why it works.",
            },
            category: {
              type: Type.STRING,
              description: "One of: '3D Animation', 'Motion Graphics', 'Technology', 'Advertising', 'Brands', 'Social Media', 'Corporate', 'Product Animation', 'Logo Reveal', 'Typography', 'Transitions', 'Cinematic', 'Infographics', 'UI Animation', 'Gaming', 'NFT', 'AI Technology', 'Futuristic', 'Medical', 'Education'",
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 cinematic keyword tags such as Space, Neon, Kinetic, HUD, Orbit",
            },
            fileFormat: {
              type: Type.STRING,
              description: "A standard output file format, preferred: Lottie JSON, MP4, WEBM, MOV, GIF",
            },
            resolution: {
              type: Type.STRING,
              description: "Assigned high-definition format resolution, e.g. 1080p, 4K, 8K, 2K",
            },
            proceduralType: {
              type: Type.STRING,
              description: "Choose exactly one best matching WebGL engine setting: 'quantum', 'dna', 'ring', 'particles', 'sine', 'matrix', 'gravity', 'hologram'",
            },
            color: {
              type: Type.STRING,
              description: "The primary glowing theme neon hex color, e.g. '#00E5FF' or '#FF00E5'",
            },
            secondaryColor: {
              type: Type.STRING,
              description: "The secondary contrast glow neon hex color, e.g. '#7B61FF' or '#00FF66'",
            },
            baseSpeed: {
              type: Type.NUMBER,
              description: "The velocity rate factor multiplier, between 0.4 and 2.5",
            },
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI engine.");
    }

    const compiledAsset = JSON.parse(text.trim());
    res.json({ success: true, asset: compiledAsset });
  } catch (err: any) {
    console.error("AI Generation failure:", err);
    res.status(500).json({ error: err.message || "Engine compilation failure." });
  }
});

// Vite middleware setup for hosting React frontend
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
