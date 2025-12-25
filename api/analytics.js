import { BetaAnalyticsDataClient } from '@google-analytics/data';

/**
 * Vercel Serverless Function - Google Analytics Data
 * 
 * Fetches real-time analytics from GA4 API.
 * Endpoint: /api/analytics
 */

export default async function handler(req, res) {
  // CORS headers for frontend access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const propertyId = process.env.GA_PROPERTY_ID;
  const clientEmail = process.env.GA_CLIENT_EMAIL;
  const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!propertyId || !clientEmail || !privateKey) {
    return res.status(500).json({ 
      error: 'Missing GA credentials',
      demo: true,
      totalUsers: 1203,
      totalViews: 2847,
      breakdown: [
        { city: 'Iloilo City', users: '423', views: '892' },
        { city: 'Manila', users: '312', views: '645' },
        { city: 'Cebu City', users: '198', views: '412' },
      ]
    });
  }

  try {
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        { name: 'city' },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
      ],
    });

    // Format the response
    const breakdown = response.rows?.map((row) => ({
      city: row.dimensionValues?.[0].value,
      users: row.metricValues?.[0].value,
      views: row.metricValues?.[1].value,
    })) || [];

    // Calculate totals
    const totalUsers = breakdown.reduce((acc, row) => acc + parseInt(row.users || '0'), 0);
    const totalViews = breakdown.reduce((acc, row) => acc + parseInt(row.views || '0'), 0);

    return res.status(200).json({ 
      demo: false,
      totalUsers, 
      totalViews,
      breakdown: breakdown.slice(0, 10) // Top 10 cities
    });

  } catch (error) {
    console.error('Analytics Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
}
