export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ request, url }) => {
  let fileUrl = url.searchParams.get("url");
  let filename = url.searchParams.get("filename") || "download";
  if (!fileUrl) {
    const urlString = url.toString();
    const urlMatch = urlString.match(/[?&]url=([^&]+)/);
    const filenameMatch = urlString.match(/[?&]filename=([^&]+)/);
    if (urlMatch) {
      fileUrl = decodeURIComponent(urlMatch[1]);
    }
    if (filenameMatch) {
      filename = decodeURIComponent(filenameMatch[1]);
    }
  }
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "") || "bN8FEA1vBJSFoceM70hnt779K76BUvzX5HB9vyL6ys0=";
  if (!fileUrl) {
    return new Response(
      JSON.stringify({
        error: "Missing file URL",
        debug: {
          searchParams: url.searchParams.toString(),
          fullUrl: url.toString()
        }
      }),
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      }
    );
  }
  try {
    const response = await fetch(fileUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "Mozilla/5.0 (compatible; AstroDownload/1.0)",
        Accept: "*/*"
      }
    });
    if (!response.ok) {
      return new Response(`Failed to fetch file: ${response.statusText}`, {
        status: response.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      });
    }
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const contentLength = response.headers.get("content-length");
    const buffer = await response.arrayBuffer();
    const headers = {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Cache-Control": "no-cache"
    };
    if (contentLength) {
      headers["Content-Length"] = contentLength;
    }
    return new Response(buffer, {
      status: 200,
      headers
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Download error:", errorMessage);
    return new Response(`Internal server error: ${errorMessage}`, {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    });
  }
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
