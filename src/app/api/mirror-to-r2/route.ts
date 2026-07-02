import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: Request) {
  try {
    const { cloudinaryUrl, fileName, contentType } = await request.json();

    if (!cloudinaryUrl || !fileName) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 1. Download the transformed/optimized file from Cloudinary (Edge Processor)
    const response = await fetch(cloudinaryUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch from Cloudinary: ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();

    // 2. Upload to Cloudflare R2 (Infinite Vault)
    const key = `resources/optimized/${Date.now()}-${fileName.replace(/\s+/g, '_')}`;
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: contentType || response.headers.get('content-type') || 'application/octet-stream',
    });

    await r2Client.send(command);

    // 3. Return the Custom Domain URL (Option B: assets.saemstunes.com)
    const publicDomain = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev`;
    const r2Url = `${publicDomain}/${key}`;

    return NextResponse.json({ success: true, r2Url });

  } catch (error) {
    console.error('[mirror-to-r2] Error:', error);
    return NextResponse.json({ error: 'Mirror pass failed' }, { status: 500 });
  }
}
