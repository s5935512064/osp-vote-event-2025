import type { APIRoute } from "astro";

// เพิ่มบรรทัดนี้เพื่อบังคับให้เป็น SSR
export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  try {
    return new Response(
      JSON.stringify({
        message: "Hello from Astro API!",
        timestamp: new Date().toISOString(),
        status: "success",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: errorMessage,
        status: "error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};
