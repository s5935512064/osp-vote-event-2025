import pkg from "file-saver";
const { saveAs } = pkg;

/**
 * Download file using proxy to bypass CORS
 * @param fileUrl - Original file URL
 * @param filename - Desired filename
 * @param useProxy - Whether to use proxy (default: true for external URLs)
 */
export async function downloadFile(
  fileUrl: string,
  filename: string = "download",
  useProxy: boolean | null = null
): Promise<void> {
  if (useProxy === null) {
    useProxy =
      fileUrl.startsWith("http") && !fileUrl.includes(window.location.hostname);
  }

  try {
    let downloadUrl = fileUrl;

    if (useProxy) {
      const proxyUrl = new URL("/api/download-proxy", window.location.origin);
      proxyUrl.searchParams.set("url", fileUrl);
      proxyUrl.searchParams.set("filename", filename);
      downloadUrl = proxyUrl.toString();
    }

    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(
        `Download failed: ${response.status} ${response.statusText}`
      );
    }

    const blob = await response.blob();
    saveAs(blob, filename);
  } catch (error: unknown) {
    console.error("Download failed:", error);

    try {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = filename;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Download failed: ${errorMessage}`);
    }
  }
}

/**
 * Get file extension from URL
 * @param url - File URL
 * @returns File extension
 */
export function getFileExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const parts = pathname.split(".");
    return parts.length > 1 ? parts.pop()?.toLowerCase() || "bin" : "bin";
  } catch {
    const parts = url.split(".");
    return parts.length > 1
      ? parts.pop()?.split("?")[0].toLowerCase() || "bin"
      : "bin";
  }
}

/**
 * Generate filename with proper extension
 * @param baseName - Base filename
 * @param url - Original URL
 * @returns Complete filename
 */
export function generateFilename(baseName: string, url: string): string {
  const extension = getFileExtension(url);
  const cleanBaseName = baseName.replace(/\.[^/.]+$/, "");
  return `${cleanBaseName}.${extension}`;
}
