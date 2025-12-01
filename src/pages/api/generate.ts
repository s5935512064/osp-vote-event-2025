import type { APIRoute } from "astro";
// import type { FreepikGenerateRequest, FreepikApiResponse } from '../../types/freepik';

export interface FreepikGenerateRequest {
  prompt: string;
  negative_prompt?: string;
  styling?: {
    style?: "photo" | "digital-art" | "anime" | "3d-model";
    color?: string;
    lighting?: string;
    framing?: string;
  };
  resolution?: "square" | "portrait" | "landscape";
  num_images?: number;
}

export interface FreepikImageObject {
  base64: string;
  seed: number;
}

export interface FreepikApiResponse {
  data: FreepikImageObject[];
  meta: {
    request_id: string;
  };
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.FREEPIK_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Server configuration error: Missing API Key" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const body = (await request.json()) as FreepikGenerateRequest;

    if (!body.prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const freepikResponse = await fetch(
      "https://api.freepik.com/v1/ai/text-to-image",
      {
        method: "POST",
        headers: {
          "x-freepik-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          prompt: body.prompt,
          styling: {
            style: body.styling?.style || "digital-art", // Default style
          },
          resolution: "square",
          num_images: 1,
        }),
      }
    );

    if (!freepikResponse.ok) {
      const errorData = await freepikResponse.json();
      console.error("Freepik API Error:", errorData);
      return new Response(
        JSON.stringify({
          error: "Failed to generate image",
          details: errorData,
        }),
        {
          status: freepikResponse.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = (await freepikResponse.json()) as FreepikApiResponse;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
