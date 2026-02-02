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
      case 'vlog-script':
        prompt = `You are an energetic Tech Vlogger (like MKBHD or MrWhoseTheBoss). Convert the following text into a YouTube Video Script.
        
Format Requirements:
- Use [CAMERA] for visual cues
- Use [B-ROLL] for overlay footage
- Use [TRANSITION] for scene changes
- tone: High energy, engaging, "Hey guys!" style
- Maintain the core information but make it spoken-word friendly

TEXT TO CONVERT:
${text}`;
        responseType = 'edit';
        break;

      case 'improve':
        prompt = `You are an energetic Tech Vlogger assistant. Improve the following text.
- Tone: High energy, punchy, engaging.
- Style: Conversational, spoke-word friendly (avoid complex sentences).
- MAINTAIN LAYOUT: strictly preserve all existing markdown structure, headers, and spacing.

TEXT TO IMPROVE:
${text}`;
        responseType = 'edit';
        break;
        
      case 'expand':
        prompt = `You are an energetic Tech Vlogger assistant. Expand the following text with more "sauce" and exciting details.
- Add relevant examples or hype.
- Keep the same format.
- MAINTAIN LAYOUT: strictly preserve all existing markdown structure.

TEXT TO EXPAND:
${text}`;
        responseType = 'edit';
        break;
        
      case 'summarize':
        prompt = `You are a Tech Vlogger. Give me the TL;DR (Too Long; Didn't Read) of this text.
- Keep it punchy and short.
- MAINTAIN LAYOUT: strictly preserve all existing markdown structure.

TEXT TO SUMMARIZE:
${text}`;
        responseType = 'edit';
        break;
        
      case 'generate':
        prompt = `Generate a high-energy Tech Vlog script about: "${title || text}". 
Structure:
- [INTRO]: Hook the viewer immediately.
- [BODY]: 3 key points with [B-ROLL] suggestions.
- [OUTRO]: Call to action (Like & Subscribe).

Format: Markdown.
Tone: Super engaging, fast-paced.`;
        responseType = 'edit';
        break;
        
      case 'grammar':
        prompt = `You are a grammar assistant. Fix errors but MAINTAIN the casual, vlog-style tone. 
- Do NOT make it sound like a robot/professor.
- Fix typos and punctuation only.

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
          /turn into script/i,
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
          
          prompt = `You are a helpful Tech Vlogger AI assistant. The user is asking a question about their script.

CURRENT CONTENT IN EDITOR:
"""
${text || '(No content yet)'}
"""

${contextStr ? `RECENT CONVERSATION:\n${contextStr}\n` : ''}

USER'S QUESTION: ${customPrompt}

Instructions:
- Answer helpfully with high energy ("Great question!", "Totally!")
- Be concise.
- If they want edits, tell them to use the quick actions.`;

        } else {
          // Edit mode
          responseType = 'edit';
          prompt = `You are an energetic Tech Vlogger assistant.
User Instruction: ${customPrompt}

CURRENT CONTENT:
"""
${text || '(No content yet)'}
"""

IMPORTANT: 
- Execute the instruction.
- Tone: High Energy.
- MAINTAIN LAYOUT strictly unless asked to change it.
- Return ONLY the modified content.`;
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
