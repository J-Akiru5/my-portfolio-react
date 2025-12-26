/* eslint-env node */

/**
 * Gemini API Handler - Smart Conversational AI Writing Assistant
 * 
 * Features:
 * - Intent detection (question/reply vs edit request)
 * - Context-aware responses
 * - Returns structured response with type: 'reply' | 'edit'
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
    const { action, text, customPrompt, title, chatHistory } = req.body;

    // eslint-disable-next-line no-undef
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    // Build prompt based on action
    let prompt = '';
    let responseType = 'edit'; // Default to edit mode
    
    // Quick actions always return edits
    switch (action) {
      case 'improve':
        prompt = `You are a writing assistant. Improve the following text by enhancing clarity, flow, and engagement while maintaining the original meaning. Keep the same tone and format (markdown if present).

IMPORTANT: Return ONLY the improved text, no explanations, no preamble, no "Here's the improved version:" - just the improved content itself.

TEXT TO IMPROVE:
${text}`;
        responseType = 'edit';
        break;
        
      case 'expand':
        prompt = `You are a writing assistant. Expand and add more detail to the following text. Add relevant examples, explanations, or supporting points. Maintain the same style and format.

IMPORTANT: Return ONLY the expanded text, no explanations, no preamble - just the expanded content itself.

TEXT TO EXPAND:
${text}`;
        responseType = 'edit';
        break;
        
      case 'summarize':
        prompt = `You are a writing assistant. Summarize the following text concisely while keeping the key points and main ideas. Keep the same format.

IMPORTANT: Return ONLY the summary, no explanations, no preamble - just the summarized content itself.

TEXT TO SUMMARIZE:
${text}`;
        responseType = 'edit';
        break;
        
      case 'generate':
        prompt = `Generate a well-structured blog article about: "${title || text}". 
Write in an engaging, conversational tone suitable for a developer portfolio blog.
Include:
- An engaging introduction
- 2-3 main sections with clear headings (use ## for headings)
- Relevant examples or insights
- A conclusion

IMPORTANT: Return ONLY the article content in Markdown format, no preamble.`;
        responseType = 'edit';
        break;
        
      case 'grammar':
        prompt = `You are a grammar assistant. Fix all grammar, spelling, and punctuation errors in the following text. Only fix errors, do not change the style or content.

IMPORTANT: Return ONLY the corrected text, no explanations, no preamble - just the corrected content itself.

TEXT TO CORRECT:
${text}`;
        responseType = 'edit';
        break;
        
      case 'custom': {
        if (!customPrompt) {
          return res.status(400).json({ error: 'Custom prompt required' });
        }
        
        // Smart intent detection for custom prompts
        const lowerPrompt = customPrompt.toLowerCase();
        
        // Patterns that indicate a QUESTION (reply mode)
        const questionPatterns = [
          /^(is|are|was|were|do|does|did|can|could|would|should|will|what|how|why|when|where|which|who)\b/i,
          /\?$/,
          /what do you think/i,
          /is (this|it|that) (good|correct|ok|okay|fine|right)/i,
          /any (suggestions|feedback|thoughts|issues|problems)/i,
          /tell me/i,
          /explain/i,
          /help me understand/i,
        ];
        
        // Patterns that indicate an EDIT request
        const editPatterns = [
          /^(fix|improve|expand|summarize|rewrite|make|change|edit|update|modify|shorten|lengthen)/i,
          /make (it|this|the text) (more|less|shorter|longer|better)/i,
          /add (more|some)/i,
          /remove|delete/i,
        ];
        
        const isQuestion = questionPatterns.some(p => p.test(lowerPrompt));
        const isEditRequest = editPatterns.some(p => p.test(lowerPrompt));
        
        if (isQuestion && !isEditRequest) {
          // Conversational reply mode
          responseType = 'reply';
          
          // Build context from chat history
          let contextStr = '';
          if (chatHistory && chatHistory.length > 0) {
            const recentHistory = chatHistory.slice(-6); // Last 6 messages
            contextStr = recentHistory.map(m => 
              `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
            ).join('\n');
          }
          
          prompt = `You are a helpful AI writing assistant integrated into a blog editor. The user is asking you a question about their content.

CURRENT CONTENT IN EDITOR:
"""
${text || '(No content yet)'}
"""

${contextStr ? `RECENT CONVERSATION:\n${contextStr}\n` : ''}

USER'S QUESTION: ${customPrompt}

Instructions:
- Answer the user's question helpfully and conversationally
- If they're asking if something is correct/good, give honest feedback
- Be concise but thorough
- If they want you to make edits, tell them to use the quick action buttons or ask specifically to "fix/improve/expand" etc.
- DO NOT randomly provide edited text unless explicitly asked to edit something`;

        } else {
          // Edit mode
          responseType = 'edit';
          prompt = `You are a writing assistant. The user has given you the following instruction for their content.

CURRENT CONTENT:
"""
${text || '(No content yet)'}
"""

USER'S INSTRUCTION: ${customPrompt}

IMPORTANT: 
- Execute the instruction on the content
- Return ONLY the modified/new content
- No explanations, no preamble, no "Here's the result:" - just the content itself
- Maintain markdown formatting if present`;
        }
        break;
      }
        
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    // Use Gemini API
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    console.log('Gemini API - Action:', action, 'Type:', responseType);
    
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
          temperature: responseType === 'reply' ? 0.8 : 0.7,
          maxOutputTokens: 4096,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText } };
      }
      return res.status(500).json({ 
        error: 'AI processing failed',
        details: errorData.error?.message || 'Unknown error'
      });
    }

    const data = await response.json();
    
    // Extract generated text from response
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      console.error('No text in response:', JSON.stringify(data));
      return res.status(500).json({ error: 'No response generated' });
    }

    return res.status(200).json({
      success: true,
      result: generatedText,
      type: responseType, // 'reply' or 'edit'
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
