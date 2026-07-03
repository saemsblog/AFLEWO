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
    const { cloudinaryUrl, cloudinaryPublicId, resourceType, fileName, contentType } = await request.json();

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

    // 3. Destroy Protocol: Wipe the file from Cloudinary to prevent storage leaks
    if (cloudinaryPublicId && resourceType) {
      const apiSecret = process.env.CLOUDINARY_API_SECRET;
      const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      
      if (apiSecret && apiKey && cloudName) {
        const timestamp = Math.round(Date.now() / 1000);
        // Important: Cloudinary requires the exact parameters alphabetically sorted for the signature
        const toSign = `public_id=${cloudinaryPublicId}&timestamp=${timestamp}${apiSecret}`;
        
        // We need crypto for the SHA1 hash
        const crypto = require('crypto');
        const signature = crypto.createHash('sha1').update(toSign).digest('hex');
        
        await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            public_id: cloudinaryPublicId,
            timestamp,
            api_key: apiKey,
            signature
          })
        }).catch(err => console.error('[Destroy Protocol] Non-fatal cleanup error:', err));
      }
    }

    // 4. Return the Custom Domain URL (Option B: assets.saemstunes.com)
    const publicDomain = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev`;
    const r2Url = `${publicDomain}/${key}`;

    return NextResponse.json({ success: true, r2Url });

  } catch (error) {
    console.error('[mirror-to-r2] Error:', error);
    return NextResponse.json({ error: 'Mirror pass failed' }, { status: 500 });
  }
}
