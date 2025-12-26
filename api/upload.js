/* eslint-env node */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

/**
 * Vercel Serverless Function - Cloudflare R2 Image Upload
 * 
 * Handles image uploads for blog posts.
 * Endpoint: POST /api/upload
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename, contentType, data } = req.body;

  if (!filename || !data) {
    return res.status(400).json({ error: 'Missing filename or data' });
  }

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || 'jeff-portfolio-images';

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return res.status(500).json({ error: 'R2 credentials not configured' });
  }

  try {
    // Initialize S3 client for R2
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // Convert base64 to buffer
    const buffer = Buffer.from(data.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    // Generate unique filename
    const timestamp = Date.now();
    const uniqueFilename = `blog/${timestamp}-${filename}`;

    // Upload to R2
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFilename,
      Body: buffer,
      ContentType: contentType || 'image/png',
    }));

    // Return the public URL using the enabled r2.dev subdomain
    const publicBaseUrl = process.env.R2_PUBLIC_URL || 'https://pub-d733b3f300ab42658923aa0f7ed6bac3.r2.dev';
    const publicUrl = `${publicBaseUrl}/${uniqueFilename}`;

    return res.status(200).json({
      success: true,
      url: publicUrl,
      key: uniqueFilename,
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({
      error: 'Failed to upload image',
      message: error.message,
    });
  }
}
