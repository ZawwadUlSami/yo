const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
  }

  // Generate a Reddit post using AI
  async generatePost(topic, subreddit, subredditInfo = null, style = 'engaging') {
    try {
      const systemPrompt = this.buildSystemPrompt(subreddit, subredditInfo, style);
      const userPrompt = `Generate a Reddit post about: ${topic}`;

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.8,
          max_tokens: 800,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const generatedText = response.data.choices[0].message.content;
      return this.parseGeneratedPost(generatedText);
    } catch (error) {
      console.error('AI Generation Error:', error.message);
      // Fallback to template-based generation if AI fails
      return this.generateFallbackPost(topic, subreddit);
    }
  }

  // Build system prompt based on subreddit context
  buildSystemPrompt(subreddit, subredditInfo, style) {
    let prompt = `You are a Reddit content creator specializing in creating engaging posts for r/${subreddit}. `;

    if (subredditInfo) {
      prompt += `The subreddit has ${subredditInfo.subscribers || 'many'} subscribers and focuses on: ${subredditInfo.description || 'various topics'}. `;
    }

    const styleGuides = {
      engaging: 'Create posts that spark discussion and engagement. Use relatable language and ask questions.',
      informative: 'Create educational and informative posts. Be clear, concise, and provide value.',
      casual: 'Write in a casual, friendly tone. Use conversational language.',
      professional: 'Maintain a professional tone. Be respectful and well-structured.',
      humorous: 'Add humor and wit where appropriate. Keep it light and entertaining.',
    };

    prompt += styleGuides[style] || styleGuides.engaging;
    prompt += '\n\nFormat your response as:\nTITLE: [post title]\nCONTENT: [post content]';
    prompt += '\n\nMake the title catchy but not clickbait. Keep content authentic and valuable.';

    return prompt;
  }

  // Parse the generated post
  parseGeneratedPost(text) {
    const titleMatch = text.match(/TITLE:\s*(.+?)(?:\n|$)/i);
    const contentMatch = text.match(/CONTENT:\s*([\s\S]+)/i);

    return {
      title: titleMatch ? titleMatch[1].trim() : 'Untitled Post',
      content: contentMatch ? contentMatch[1].trim() : text,
    };
  }

  // Fallback template-based generation
  generateFallbackPost(topic, subreddit) {
    const templates = [
      {
        title: `Let's discuss: ${topic}`,
        content: `Hey r/${subreddit}!\n\nI wanted to start a discussion about ${topic}. What are your thoughts and experiences with this?\n\nI'm curious to hear different perspectives from the community!`,
      },
      {
        title: `Question about ${topic}`,
        content: `Hi everyone,\n\nI've been thinking about ${topic} lately and would love to get your input.\n\nWhat's your take on this? Any insights or experiences you'd like to share?`,
      },
      {
        title: `${topic} - What's your experience?`,
        content: `Hello r/${subreddit},\n\nI'd like to hear from the community about ${topic}.\n\nWhat has been your experience? Any tips or advice for others?`,
      },
    ];

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    return randomTemplate;
  }

  // Generate multiple post variations
  async generateVariations(topic, subreddit, count = 3) {
    const variations = [];

    for (let i = 0; i < count; i++) {
      const post = await this.generatePost(topic, subreddit);
      variations.push(post);
    }

    return variations;
  }

  // Optimize post for engagement
  async optimizePost(title, content, subreddit) {
    try {
      const prompt = `Optimize this Reddit post for r/${subreddit} to increase engagement:\n\nTitle: ${title}\nContent: ${content}\n\nProvide an improved version with:\n1. More engaging title\n2. Better structured content\n3. Clear call-to-action\n\nFormat as:\nTITLE: [optimized title]\nCONTENT: [optimized content]`;

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 800,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return this.parseGeneratedPost(response.data.choices[0].message.content);
    } catch (error) {
      return { title, content };
    }
  }

  // Generate post based on trending topics
  async generateFromTrending(trendingTopics, subreddit) {
    if (!trendingTopics || trendingTopics.length === 0) {
      throw new Error('No trending topics provided');
    }

    const topTrend = trendingTopics[0];
    const prompt = `Based on the trending topic "${topTrend.topic}" in r/${subreddit}, generate an engaging Reddit post.`;

    return await this.generatePost(prompt, subreddit);
  }

  // Check if post follows subreddit rules
  async checkCompliance(title, content, rules) {
    if (!rules || rules.length === 0) {
      return { compliant: true, warnings: [] };
    }

    const warnings = [];

    // Basic checks
    if (title.length > 300) {
      warnings.push('Title may be too long');
    }

    if (content.length < 50) {
      warnings.push('Content may be too short');
    }

    // Check for common rule violations
    const lowerContent = (title + ' ' + content).toLowerCase();

    if (lowerContent.includes('upvote') || lowerContent.includes('karma')) {
      warnings.push('Possible vote manipulation');
    }

    if (lowerContent.includes('buy') || lowerContent.includes('sale')) {
      warnings.push('May contain promotional content');
    }

    return {
      compliant: warnings.length === 0,
      warnings: warnings,
    };
  }
}

module.exports = new AIService();
