import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
    const { fileName, contentType } = await request.json();

    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'Missing fileName or contentType' }, { status: 400 });
    }

    // Security Check: Block dangerous MIME types or executables
    if (contentType.includes('exe') || contentType.includes('javascript')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 403 });
    }

    const key = `resources/raw/${Date.now()}-${fileName.replace(/\s+/g, '_')}`;
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    // 5-minute temporary upload URL
    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });

    // Option B: Custom Domain for the final public URL
    const publicDomain = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev`;
    const finalUrl = `${publicDomain}/${key}`;

    return NextResponse.json({ uploadUrl, finalUrl });
  } catch (error) {
    console.error('[r2-upload-signature] Error generating R2 signature:', error);
    return NextResponse.json(
      { error: 'Failed to provision R2 signature' },
      { status: 500 }
    );
  }
}
