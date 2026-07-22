import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import sharp from "sharp";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const relativeSrc = searchParams.get("src");
    const forceWatermark = searchParams.get("watermark") === "true";

    if (!relativeSrc) {
      return new NextResponse("Missing src parameter", { status: 400 });
    }

    const sanitizedSrc = relativeSrc.replace(/^\/+/, "").replace(/\.\.\//g, "");
    const baseImagePath = path.join(process.cwd(), "public", sanitizedSrc);

    if (!fs.existsSync(baseImagePath)) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const referer = request.headers.get("referer") || "";
    const secFetchDest = request.headers.get("sec-fetch-dest") || "";
    const secFetchSite = request.headers.get("sec-fetch-site") || "";
    const host = request.headers.get("host") || "";

    // Determine if request is an external view, direct address bar navigation, or download
    const isDirectNavigation = secFetchDest === "document" || secFetchSite === "none" || secFetchSite === "cross-site";
    const isExternalReferer = !referer || !referer.includes(host);
    const requiresWatermark = forceWatermark || isDirectNavigation || isExternalReferer;

    const baseImage = sharp(baseImagePath);

    // If request is internal from on-site canvas, return clean image without watermark
    if (!requiresWatermark) {
      const metadata = await baseImage.metadata();
      const format = metadata.format === "png" ? "png" : "jpeg";
      const buffer = await baseImage.toFormat(format, { quality: 90 }).toBuffer();

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": `image/${format}`,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // Apply ONLY the single logo.png watermark for external/direct views & downloads
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const hasLogo = fs.existsSync(logoPath);
    const metadata = await baseImage.metadata();
    const width = metadata.width || 800;
    const height = metadata.height || 600;

    let compositePipeline = baseImage;

    if (hasLogo) {
      const logoWidth = Math.max(120, Math.floor(width * 0.28));

      const resizedLogo = await sharp(logoPath)
        .resize({ width: logoWidth })
        .composite([
          {
            input: Buffer.from([255, 255, 255, Math.floor(255 * 0.45)]),
            raw: { width: 1, height: 1, channels: 4 },
            tile: true,
            blend: "dest-in",
          },
        ])
        .toBuffer();

      const logoMetadata = await sharp(resizedLogo).metadata();
      const logoHeight = logoMetadata.height || logoWidth;

      const left = Math.floor((width - logoWidth) / 2);
      const top = Math.floor((height - logoHeight) / 2);

      compositePipeline = baseImage.composite([
        {
          input: resizedLogo,
          top: Math.max(0, top),
          left: Math.max(0, left),
        },
      ]);
    }

    const format = metadata.format === "png" ? "png" : "jpeg";
    const outputBuffer = await compositePipeline.toFormat(format, { quality: 90 }).toBuffer();

    return new NextResponse(outputBuffer, {
      headers: {
        "Content-Type": `image/${format}`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Watermark processing error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
