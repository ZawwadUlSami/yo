// Mock Posts Data
export const mockPosts = [
  {
    _id: '1',
    title: 'How to Build a Successful SaaS Startup in 2024',
    content: 'Starting a SaaS business requires careful planning and execution. Here are the key steps I learned from my journey...\n\n1. Validate your idea\n2. Build an MVP\n3. Get early customers\n4. Iterate based on feedback',
    subreddit: 'entrepreneur',
    status: 'posted',
    redditUsername: 'demo_user',
    generatedByAI: true,
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    analytics: {
      upvotes: 342,
      downvotes: 12,
      comments: 45,
      karma: 330
    }
  },
  {
    _id: '2',
    title: 'What programming language should I learn in 2024?',
    content: 'Hey everyone! I\'m new to programming and trying to decide which language to start with. I\'m interested in web development and potentially mobile apps in the future.\n\nWhat would you recommend?',
    subreddit: 'learnprogramming',
    status: 'posted',
    redditUsername: 'demo_user',
    generatedByAI: true,
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    analytics: {
      upvotes: 156,
      downvotes: 8,
      comments: 89,
      karma: 148
    }
  },
  {
    _id: '3',
    title: 'My journey from $0 to $10k MRR in 6 months',
    content: 'I want to share my journey building a profitable SaaS product. Here\'s what worked for me:\n\n- Found a real problem\n- Built in public\n- Content marketing\n- Community building\n\nAMA!',
    subreddit: 'SideProject',
    status: 'scheduled',
    redditUsername: 'demo_user',
    generatedByAI: true,
    scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    analytics: null
  },
  {
    _id: '4',
    title: 'Best productivity tools for developers in 2024',
    content: 'After trying dozens of tools, here are my top picks for staying productive as a developer...',
    subreddit: 'programming',
    status: 'draft',
    redditUsername: 'demo_user',
    generatedByAI: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    analytics: null
  },
  {
    _id: '5',
    title: 'How I automated my Reddit marketing and grew 10x',
    content: 'Marketing on Reddit can be time-consuming. Here\'s how I automated the process while staying authentic...',
    subreddit: 'marketing',
    status: 'draft',
    redditUsername: 'demo_user',
    generatedByAI: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    analytics: null
  }
];

// Mock Subreddits Data
export const mockSubreddits = [
  {
    name: 'entrepreneur',
    subscribers: 1234567,
    description: 'A community for entrepreneurs, startups, and business owners.',
    rules: [
      { title: 'No self-promotion', description: 'Do not promote your business without providing value' },
      { title: 'Be respectful', description: 'Treat others with respect and kindness' },
      { title: 'Quality content only', description: 'Share valuable insights and experiences' }
    ],
    analytics: {
      averageUpvotes: 245,
      averageComments: 34,
      topPostingTimes: [
        { dayOfWeek: 'tuesday', hour: 9, averageScore: 450, postCount: 23 },
        { dayOfWeek: 'wednesday', hour: 14, averageScore: 420, postCount: 19 },
        { dayOfWeek: 'monday', hour: 10, averageScore: 380, postCount: 25 }
      ],
      trendingTopics: [
        { topic: 'startup', mentions: 45 },
        { topic: 'funding', mentions: 32 },
        { topic: 'growth', mentions: 28 },
        { topic: 'marketing', mentions: 24 },
        { topic: 'sales', mentions: 20 }
      ]
    }
  },
  {
    name: 'learnprogramming',
    subscribers: 987654,
    description: 'A subreddit for all questions related to programming.',
    rules: [
      { title: 'Do your research first', description: 'Search before asking' },
      { title: 'Be helpful', description: 'Help others learn' },
      { title: 'No spam', description: 'No promotional content' }
    ],
    analytics: {
      averageUpvotes: 123,
      averageComments: 56,
      topPostingTimes: [
        { dayOfWeek: 'monday', hour: 15, averageScore: 280, postCount: 34 },
        { dayOfWeek: 'thursday', hour: 11, averageScore: 260, postCount: 28 },
        { dayOfWeek: 'saturday', hour: 13, averageScore: 240, postCount: 31 }
      ],
      trendingTopics: [
        { topic: 'python', mentions: 67 },
        { topic: 'javascript', mentions: 54 },
        { topic: 'tutorial', mentions: 43 },
        { topic: 'beginner', mentions: 38 },
        { topic: 'project', mentions: 29 }
      ]
    }
  }
];

// Mock AI Generated Post Templates
export const aiTemplates = {
  engaging: [
    {
      title: "Let's discuss: {topic}",
      content: "Hey r/{subreddit}!\n\nI wanted to start a discussion about {topic}. What are your thoughts and experiences with this?\n\nI'm curious to hear different perspectives from the community!"
    },
    {
      title: "What's your experience with {topic}?",
      content: "Hi everyone,\n\nI've been exploring {topic} lately and would love to get your input.\n\nWhat has been your experience? Any insights or advice you'd like to share?"
    }
  ],
  informative: [
    {
      title: "Understanding {topic}: A Comprehensive Guide",
      content: "Hello r/{subreddit},\n\nI've put together this guide about {topic} based on my research and experience.\n\nKey points:\n- Overview and importance\n- Best practices\n- Common pitfalls to avoid\n\nHope this helps!"
    }
  ],
  casual: [
    {
      title: "Anyone else into {topic}?",
      content: "What's up r/{subreddit}!\n\nJust wanted to chat about {topic}. Been really getting into it lately and wondering if anyone else is on the same wavelength.\n\nLet's share experiences!"
    }
  ],
  professional: [
    {
      title: "Professional insights on {topic}",
      content: "Greetings r/{subreddit},\n\nI'd like to share some professional insights regarding {topic}.\n\nBased on industry experience, here are key considerations:\n\n1. Strategic approach\n2. Implementation best practices\n3. Measuring success"
    }
  ],
  humorous: [
    {
      title: "{topic} - Am I doing this right? 😅",
      content: "Hey r/{subreddit}!\n\nSo I've been trying to figure out {topic} and... let's just say it's been an adventure! 😂\n\nAnyone else struggle with this at first? Would love to hear your funny stories!"
    }
  ]
};
