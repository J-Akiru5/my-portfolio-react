/* eslint-env node */

/**
 * Gemini API Handler - AI Writing Assistant
 * 
 * Handles various AI writing actions for the blog editor.
 * Uses the Gemini REST API directly (same as SineAI Hub implementation).
 */
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

  try {
    const { action, text, customPrompt, title } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    // Build prompt based on action
    let prompt = '';
    
    switch (action) {
      case 'improve':
        prompt = `Improve the following text by enhancing clarity, flow, and engagement while maintaining the original meaning. Keep the same tone and format (markdown if present). Return only the improved text, no explanations:

${text}`;
        break;
        
      case 'expand':
        prompt = `Expand and add more detail to the following text. Add relevant examples, explanations, or supporting points. Maintain the same style and format. Return only the expanded text:

${text}`;
        break;
        
      case 'summarize':
        prompt = `Summarize the following text concisely while keeping the key points and main ideas. Return only the summary in the same format:

${text}`;
        break;
        
      case 'generate':
        prompt = `Generate a well-structured blog article about: "${title || text}". 
Write in an engaging, conversational tone suitable for a developer portfolio blog.
Include:
- An engaging introduction
- 2-3 main sections with clear headings (use ## for headings)
- Relevant examples or insights
- A conclusion

Return the content in Markdown format.`;
        break;
        
      case 'grammar':
        prompt = `Fix all grammar, spelling, and punctuation errors in the following text. Only fix errors, do not change the style or content. Return only the corrected text:

${text}`;
        break;
        
      case 'custom':
        if (!customPrompt) {
          return res.status(400).json({ error: 'Custom prompt required' });
        }
        prompt = `${customPrompt}

Content to work with:
${text || '(No content provided - generate from scratch based on the instructions above)'}`;
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    // Use direct REST API endpoint (same as SineAI Hub)
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return res.status(500).json({ 
        error: 'AI processing failed',
        details: errorData.error?.message || 'Unknown error'
      });
    }

    const data = await response.json();
    
    // Extract generated text from response
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      return res.status(500).json({ error: 'No response generated' });
    }

    return res.status(200).json({
      success: true,
      result: generatedText,
      action: action
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: 'AI processing failed',
      message: error.message
    });
  }
}
