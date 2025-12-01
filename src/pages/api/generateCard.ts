import type { APIRoute } from "astro";
import { GoogleGenAI } from "@google/genai";

export const prerender = false;

const API_KEY = import.meta.env.GOOGLE_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const POST: APIRoute = async ({ request }) => {
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "Missing API Key" }), {
      status: 500,
    });
  }

  try {
    const body = await request.json();
    // const { prompt } = body;

    const prompt =
      "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    console.log(response);

    // 3. ดึงข้อมูลรูปภาพ (Base64) จาก Response
    let generatedBase64 = null;
    const candidates = response.candidates;

    if (candidates && candidates[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          generatedBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!generatedBase64) {
      throw new Error("No image generated from AI");
    }

    // 4. ส่ง Base64 กลับไปให้ Frontend
    return new Response(
      JSON.stringify({
        success: true,
        imageBase64: generatedBase64,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("GenAI Error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
