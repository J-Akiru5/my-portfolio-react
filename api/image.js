/* eslint-disable no-undef */
/* eslint-env node */
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

/**
 * Vercel Serverless Function - R2 Image Proxy
 * 
 * Serves images from R2 storage through Vercel's domain.
 * This bypasses R2 public URL issues by fetching directly from R2.
 * 
 * Endpoint: GET /api/image?key=blog/1234-image.png
 */

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: 'Missing image key' });
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

    // Fetch the image from R2
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await s3Client.send(command);

    // Set appropriate headers
    res.setHeader('Content-Type', response.ContentType || 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year
    res.setHeader('Content-Length', response.ContentLength);

    // Stream the image to the response
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    return res.status(200).send(buffer);

  } catch (error) {
    console.error('Image Proxy Error:', error);
    
    if (error.name === 'NoSuchKey') {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    return res.status(500).json({
      error: 'Failed to fetch image',
      message: error.message,
    });
  }
}
