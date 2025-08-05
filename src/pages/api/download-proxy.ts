import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, url }) => {
  const fileUrl = url.searchParams.get("url");
  const filename = url.searchParams.get("filename") || "download";

  if (!fileUrl) {
    return new Response("Missing file URL", {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    const response = await fetch(fileUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AstroProxy/1.0)",
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      return new Response(`Failed to fetch file: ${response.statusText}`, {
        status: response.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const contentLength = response.headers.get("content-length");
    const buffer = await response.arrayBuffer();

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-cache",
    };

    if (contentLength) {
      headers["Content-Length"] = contentLength;
    }

    return new Response(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(`Internal server error: ${errorMessage}`, {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
