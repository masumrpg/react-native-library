import * as fs from "node:fs";
import * as path from "node:path";

export interface ResolvedImage {
  src: string;
  buffer: Buffer;
  mimeType: string;
  width?: number;
  height?: number;
  dataUri: string;
  isSvg: boolean;
}

const memoryImageCache = new Map<string, ResolvedImage>();

/**
 * Infers MIME type from file extension or data URI header.
 */
export function getMimeType(filePathOrUrl: string): string {
  const clean = filePathOrUrl.split("?")[0].toLowerCase();
  if (clean.endsWith(".png")) return "image/png";
  if (clean.endsWith(".jpg") || clean.endsWith(".jpeg")) return "image/jpeg";
  if (clean.endsWith(".gif")) return "image/gif";
  if (clean.endsWith(".svg")) return "image/svg+xml";
  if (clean.endsWith(".webp")) return "image/webp";
  if (clean.endsWith(".bmp")) return "image/bmp";
  return "image/png";
}

/**
 * Resolves an image source (relative path, remote URL, or base64 data URI) into a binary buffer.
 */
export async function resolveImage(
  src: string,
  baseDir: string = process.cwd()
): Promise<ResolvedImage | null> {
  const cacheKey = `${baseDir}::${src}`;
  if (memoryImageCache.has(cacheKey)) {
    return memoryImageCache.get(cacheKey)!;
  }

  try {
    // 1. Data URI: data:image/png;base64,...
    if (src.startsWith("data:")) {
      const parts = src.split(",");
      const meta = parts[0];
      const base64Data = parts[1];
      const mimeMatch = meta.match(/data:([^;]+)/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/png";
      const buffer = Buffer.from(base64Data, "base64");
      const isSvg = mimeType === "image/svg+xml";

      const resolved: ResolvedImage = {
        src,
        buffer,
        mimeType,
        dataUri: src,
        isSvg,
      };
      memoryImageCache.set(cacheKey, resolved);
      return resolved;
    }

    // 2. Remote HTTP / HTTPS URL
    if (src.startsWith("http://") || src.startsWith("https://")) {
      const response = await fetch(src, { signal: AbortSignal.timeout(10000) });
      if (!response.ok) {
        return null;
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = response.headers.get("content-type") || getMimeType(src);
      const mimeType = contentType.split(";")[0].trim();
      const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
      const isSvg = mimeType === "image/svg+xml";

      const resolved: ResolvedImage = {
        src,
        buffer,
        mimeType,
        dataUri,
        isSvg,
      };
      memoryImageCache.set(cacheKey, resolved);
      return resolved;
    }

    // 3. Local File Path
    const localPath = path.isAbsolute(src) ? src : path.resolve(baseDir, src);
    if (!fs.existsSync(localPath)) {
      return null;
    }

    const buffer = fs.readFileSync(localPath);
    const mimeType = getMimeType(localPath);
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
    const isSvg = mimeType === "image/svg+xml";

    const resolved: ResolvedImage = {
      src,
      buffer,
      mimeType,
      dataUri,
      isSvg,
    };
    memoryImageCache.set(cacheKey, resolved);
    return resolved;
  } catch {
    return null;
  }
}

/**
 * Inlines all image sources in an HTML string with Base64 data URIs.
 */
export async function inlineHtmlImages(
  html: string,
  baseDir: string = process.cwd()
): Promise<string> {
  const imgRegex = /<img([^>]+)src=["']([^"']+)["']([^>]*)>/gi;
  const matches = Array.from(html.matchAll(imgRegex));

  let inlinedHtml = html;
  for (const match of matches) {
    const fullTag = match[0];
    const beforeSrc = match[1];
    const src = match[2];
    const afterSrc = match[3];

    const resolved = await resolveImage(src, baseDir);
    if (resolved) {
      const replacement = `<img${beforeSrc}src="${resolved.dataUri}"${afterSrc}>`;
      inlinedHtml = inlinedHtml.replace(fullTag, replacement);
    }
  }

  return inlinedHtml;
}
