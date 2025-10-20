# Reddit Growth Tool - AI-Powered Reddit Marketing Platform

An all-in-one MERN stack application for growing your Reddit presence using AI-powered post generation, analytics, and strategic insights.

## Features

### 🤖 AI Post Generation
- Generate engaging Reddit posts using AI (OpenAI GPT integration)
- Customize writing style (engaging, informative, casual, professional, humorous)
- Subreddit-specific optimization
- Multiple post variations

### 📊 Subreddit Analyzer
- Real-time subreddit analytics
- Trending topics detection
- Best posting times analysis
- Subreddit rules checker
- Average engagement metrics

### ⏰ Post Scheduler
- Schedule posts for optimal times
- Manage drafts, scheduled, and posted content
- Automatic posting via cron jobs
- Post status tracking

### 📈 Analytics Dashboard
- Track total karma and engagement
- View top-performing posts
- Subreddit performance metrics
- Average upvotes and comments tracking

### 👥 Multi-Account Management
- Manage multiple Reddit accounts
- Switch between accounts easily
- Account-specific post tracking

### ✅ Additional Features
- User authentication with JWT
- Post history and management
- Karma growth tracking
- Reddit API integration
- Responsive design

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Axios** - HTTP client
- **node-cron** - Task scheduling

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - API calls
- **Context API** - State management

### APIs & Services
- **Reddit API** - Reddit integration
- **OpenAI API** - AI post generation

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Reddit API credentials
- OpenAI API key

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd reddit-growth-tool
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create `.env` file in the backend directory:
```bash
cp ../.env.example .env
```

4. Configure your environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reddit-growth-tool
JWT_SECRET=your_secure_jwt_secret
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_REDIRECT_URI=http://localhost:3000/auth/reddit/callback
OPENAI_API_KEY=your_openai_api_key
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

2. Create `.env` file in the frontend directory:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Reddit API Setup

1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" or "Create Another App"
3. Fill in the details:
   - Name: Reddit Growth Tool
   - App type: web app
   - Redirect URI: http://localhost:3000/auth/reddit/callback
4. Copy the client ID and secret to your `.env` file

## OpenAI API Setup

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key to your `.env` file as `OPENAI_API_KEY`

## Usage

### 1. Register/Login
- Create an account or log in with existing credentials
- Your data is secured with JWT authentication

### 2. Connect Reddit Account
- Link your Reddit account to enable posting
- Manage multiple Reddit accounts

### 3. Analyze Subreddits
- Navigate to "Subreddit Analyzer"
- Enter a subreddit name to analyze
- View trending topics, best posting times, and rules

### 4. Generate Posts
- Go to "AI Post Generator"
- Enter your topic and target subreddit
- Select writing style
- Generate and preview posts
- Save as draft or publish

### 5. Schedule Posts
- Access "Post Scheduler"
- View all your posts (drafts, scheduled, posted)
- Schedule posts for optimal times
- Publish immediately or schedule for later

### 6. Track Analytics
- Visit "Analytics" to view performance
- See top-performing posts
- Track karma growth
- Analyze subreddit performance

## Project Structure

```
reddit-growth-tool/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── models/
│   │   ├── User.js               # User model
│   │   ├── Post.js               # Post model
│   │   └── Subreddit.js          # Subreddit model
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication routes
│   │   ├── postRoutes.js         # Post routes
│   │   └── subredditRoutes.js    # Subreddit routes
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── postController.js     # Post logic
│   │   └── subredditController.js # Subreddit logic
│   ├── middleware/
│   │   └── auth.js               # JWT middleware
│   ├── services/
│   │   ├── redditService.js      # Reddit API service
│   │   ├── aiService.js          # AI generation service
│   │   └── schedulerService.js   # Post scheduler
│   ├── package.json
│   └── server.js                 # Entry point
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js         # Main layout
│   │   │   └── PrivateRoute.js   # Protected routes
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── PostGenerator.js
│   │   │   ├── PostScheduler.js
│   │   │   ├── SubredditAnalyzer.js
│   │   │   └── Analytics.js
│   │   ├── context/
│   │   │   └── AuthContext.js    # Auth state
│   │   ├── services/
│   │   │   └── api.js            # API client
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Posts
- `POST /api/posts/generate` - Generate AI post
- `GET /api/posts` - Get all user posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post manually
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/schedule` - Schedule post
- `POST /api/posts/:id/publish` - Publish post to Reddit
- `GET /api/posts/:id/analytics` - Get post analytics

### Subreddits
- `POST /api/subreddits/analyze` - Analyze subreddit
- `GET /api/subreddits` - Get analyzed subreddits
- `GET /api/subreddits/:name` - Get subreddit info
- `GET /api/subreddits/:name/trending` - Get trending topics
- `GET /api/subreddits/:name/best-times` - Get best posting times
- `GET /api/subreddits/:name/top-posts` - Get top posts

## Features Not Included

As per requirements, the following feature is NOT included:
- Direct Messaging (DM) functionality

## Best Practices

1. **Respect Reddit's Rules**
   - Always follow subreddit rules
   - Don't spam
   - Provide genuine value to communities

2. **Post Quality**
   - Review AI-generated posts before publishing
   - Customize posts for each subreddit
   - Engage authentically

3. **Scheduling**
   - Use analytics to find best posting times
   - Don't post too frequently
   - Maintain consistent posting schedule

4. **Account Safety**
   - Use Reddit API responsibly
   - Don't exceed rate limits
   - Keep your credentials secure

## Development

### Running in Development Mode

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

Backend:
```bash
cd backend
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License - feel free to use this project for learning and commercial purposes.

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review Reddit API and OpenAI API docs

## Roadmap

Future enhancements:
- Comment generation and management
- A/B testing for posts
- Advanced analytics with charts
- Browser extension
- Mobile app
- Team collaboration features
- Content calendar view
- Image post support
- Webhook integrations

## Acknowledgments

- Reddit API
- OpenAI API
- MERN Stack Community

---

Built with ❤️ for Reddit growth enthusiasts
