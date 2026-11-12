import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

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
 * Extracts natural image dimensions (width & height) from buffer headers without external dependencies.
 * Supports PNG, GIF, JPEG, WebP, SVG, and BMP.
 */
export function getImageDimensions(buffer: Buffer): { width: number; height: number } | null {
  if (!buffer || buffer.length < 8) return null;

  try {
    // 1. PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      buffer.length >= 24 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      if (width > 0 && height > 0) return { width, height };
    }

    // 2. GIF: GIF87a or GIF89a
    if (
      buffer.length >= 10 &&
      buffer[0] === 0x47 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46
    ) {
      const width = buffer.readUInt16LE(6);
      const height = buffer.readUInt16LE(8);
      if (width > 0 && height > 0) return { width, height };
    }

    // 3. JPEG / JPG: FF D8
    if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset < buffer.length - 8) {
        if (buffer[offset] !== 0xff) {
          offset++;
          continue;
        }
        const marker = buffer[offset + 1];
        if (
          (marker >= 0xc0 && marker <= 0xc3) ||
          (marker >= 0xc5 && marker <= 0xc7) ||
          (marker >= 0xc9 && marker <= 0xcb) ||
          (marker >= 0xcd && marker <= 0xcf)
        ) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          if (width > 0 && height > 0) return { width, height };
        }
        const length = buffer.readUInt16BE(offset + 2);
        offset += 2 + length;
      }
    }

    // 4. BMP: 42 4D
    if (buffer.length >= 26 && buffer[0] === 0x42 && buffer[1] === 0x4d) {
      const width = Math.abs(buffer.readInt32LE(18));
      const height = Math.abs(buffer.readInt32LE(22));
      if (width > 0 && height > 0) return { width, height };
    }

    // 5. WebP: RIFF ... WEBP
    if (
      buffer.length >= 30 &&
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    ) {
      const type = buffer.subarray(12, 16).toString("ascii");
      if (type === "VP8 " && buffer.length >= 30) {
        const width = buffer.readUInt16LE(26) & 0x3fff;
        const height = buffer.readUInt16LE(28) & 0x3fff;
        if (width > 0 && height > 0) return { width, height };
      } else if (type === "VP8L" && buffer.length >= 25) {
        const b0 = buffer[21];
        const b1 = buffer[22];
        const b2 = buffer[23];
        const b3 = buffer[24];
        const width = 1 + (((b1 & 0x3f) << 8) | b0);
        const height = 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
        if (width > 0 && height > 0) return { width, height };
      } else if (type === "VP8X" && buffer.length >= 30) {
        const width = 1 + (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16));
        const height = 1 + (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16));
        if (width > 0 && height > 0) return { width, height };
      }
    }

    // 6. SVG: XML containing width, height, or viewBox
    const headText = buffer.subarray(0, Math.min(buffer.length, 4096)).toString("utf-8");
    if (headText.includes("<svg")) {
      const widthMatch = headText.match(/\bwidth=["']([0-9.]+)(?:px)?["']/i);
      const heightMatch = headText.match(/\bheight=["']([0-9.]+)(?:px)?["']/i);
      const viewBoxMatch = headText.match(
        /\bviewBox=["']\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*["']/i
      );

      let w = widthMatch ? parseFloat(widthMatch[1]) : undefined;
      let h = heightMatch ? parseFloat(heightMatch[1]) : undefined;

      if ((!w || !h) && viewBoxMatch) {
        const vbW = parseFloat(viewBoxMatch[3]);
        const vbH = parseFloat(viewBoxMatch[4]);
        if (!w && !h) {
          w = vbW;
          h = vbH;
        } else if (w && !h && vbW > 0) {
          h = w * (vbH / vbW);
        } else if (!w && h && vbH > 0) {
          w = h * (vbW / vbH);
        }
      }
      if (w && h && w > 0 && h > 0) {
        return { width: Math.round(w), height: Math.round(h) };
      }
    }
  } catch {
    // ignore
  }

  return null;
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
      const dims = getImageDimensions(buffer);

      const resolved: ResolvedImage = {
        src,
        buffer,
        mimeType,
        width: dims?.width,
        height: dims?.height,
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
      const dims = getImageDimensions(buffer);

      const resolved: ResolvedImage = {
        src,
        buffer,
        mimeType,
        width: dims?.width,
        height: dims?.height,
        dataUri,
        isSvg,
      };
      memoryImageCache.set(cacheKey, resolved);
      return resolved;
    }

    // 3. Local File Path (including file:// URIs)
    let localPath = src;
    if (src.startsWith("file://")) {
      try {
        localPath = fileURLToPath(src);
      } catch {
        localPath = src;
      }
    }

    if (!path.isAbsolute(localPath)) {
      localPath = path.resolve(baseDir, localPath);
    }
    if (!fs.existsSync(localPath)) {
      const cwdPath = path.resolve(process.cwd(), src.startsWith("file://") ? localPath : src);
      if (fs.existsSync(cwdPath)) {
        localPath = cwdPath;
      } else {
        return null;
      }
    }

    const buffer = fs.readFileSync(localPath);
    const mimeType = getMimeType(localPath);
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
    const isSvg = mimeType === "image/svg+xml";
    const dims = getImageDimensions(buffer);

    const resolved: ResolvedImage = {
      src,
      buffer,
      mimeType,
      width: dims?.width,
      height: dims?.height,
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
