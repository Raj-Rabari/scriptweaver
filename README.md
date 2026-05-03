# 🤖 ScriptWeaver - AI-Powered Content Generator

ScriptWeaver is a modern web application that leverages Google's Gemini AI to generate engaging, platform-optimized scripts and content for social media creators. It features a responsive Angular frontend with real-time streaming, user authentication, conversation management, and a secure Node.js/Express backend that proxies AI requests.

## Features

- 🎬 **Multi-Platform Content Generation**: Tailored scripts for Instagram, YouTube, TikTok, X/Twitter, LinkedIn, and more
- 🚀 **AI-Powered Optimization**: Gemini 2.5 Flash analyzes topics to create viral-ready content
- ⚡ **Real-Time Streaming**: Watch AI-generated content appear live as tokens stream in
- 📝 **Format-Specific Outputs**:
  - Short-form video scripts (Reels, TikTok, Shorts)
  - Long-form tutorials (YouTube)
  - Social media posts and captions
  - AI avatar scripts with stage directions
- 🔐 **User Authentication**: Secure JWT-based auth with refresh tokens
- 💬 **Conversation Management**: Save, organize, and manage chat histories
- 🎨 **Modern UI**: Clean, responsive design with dark theme
- ♿ **Accessible**: Built with accessibility best practices
- 🐳 **Containerized**: Docker-ready for easy deployment

## Architecture

- **Frontend**: Angular 21 SPA with routing, signals, and HTTP interceptors
- **Backend**: Node.js/Express API with TypeScript, MongoDB Atlas, and streaming responses
- **AI**: Google Generative AI (Gemini 2.5 Flash) for content generation
- **Database**: MongoDB Atlas (M0 free tier) for users, conversations, and messages
- **Deployment**: Docker containers on AWS ECR/EC2

## Tech Stack

### Frontend

- **Framework**: Angular 21
- **Language**: TypeScript 5.9
- **Styling**: SCSS
- **Testing**: Vitest
- **Build Tool**: Angular CLI

### Backend

- **Runtime**: Node.js 18+ with ESM
- **Framework**: Express 5
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB with Mongoose
- **Auth**: JWT (access + refresh tokens)
- **Security**: Helmet, CORS, rate limiting
- **Logging**: Pino

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for local development)
- Google Generative AI API key
- MongoDB Atlas account (free tier available)

### Local Development

1. **Clone both repositories**:

   ```bash
   git clone https://github.com/yourusername/scriptweaver.git
   git clone https://github.com/yourusername/scriptweaver-backend.git
   ```

2. **Set up the backend**:

   ```bash
   cd scriptweaver-backend
   npm install
   # Create .env file with required variables
   cp .env.example .env  # (if provided, or create manually)
   # Edit .env with your GEMINI_API_KEY, MONGODB_URI, JWT secrets, etc.
   npm run dev
   ```

3. **Set up the frontend**:

   ```bash
   cd scriptweaver
   npm install
   npm start
   ```

4. **Or use Docker Compose** (recommended for full stack):
   ```bash
   # From the workspace root
   docker-compose up --build
   ```

The app will be available at:

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

### Configuration

#### Backend Environment Variables

Create a `.env` file in `scriptweaver-backend/` with:

```env
GEMINI_API_KEY=your_google_ai_api_key
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
PORT=3000
CORS_ORIGIN=http://localhost:4200
```

#### Frontend Environment

The frontend automatically uses the correct API URL based on the environment:

- Development: `http://localhost:3000/api`
- Production: `https://yourdomain.com/api`

### Building for Production

```bash
# Frontend
cd scriptweaver
npm run build

# Backend
cd scriptweaver-backend
npm run build
```

## API Documentation

The backend provides a REST API under `/api`:

- **Auth**: `/api/auth/*` - Signup, login, refresh, logout
- **Conversations**: `/api/conversations/*` - CRUD operations and message streaming
- **Health**: `/api/healthz` - Service health check

All endpoints (except auth) require Bearer token authentication.

## Deployment

The application is designed for containerized deployment:

1. Push to `main` branch triggers GitHub Actions
2. Builds Docker images and pushes to AWS ECR
3. Deploys to EC2 instance via ECR pull

Required GitHub Secrets:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`

## Contributing

1. Fork the repositories
2. Create feature branches
3. Ensure tests pass and builds succeed
4. Submit PRs to `main`

## License

ISC
private apiKey = 'YOUR_API_KEY_HERE';

````

### Development

```bash
# Start development server
npm start
# Navigate to http://localhost:4200/
````

### Build

```bash
# Build for production
npm run build
# Output will be in dist/scriptweaver
```

### Testing

```bash
# Run unit tests
npm test
```

## Usage

1. Enter your topic or concept in the input field
2. Optionally specify a platform (Instagram, YouTube, TikTok, etc.)
3. Click "Generate" to create content
4. Watch as the AI generates your content in real-time
5. Copy and use the generated content on your platform

## Project Structure

```
src/
├── app/
│   ├── api.ts              # Google Generative AI service
│   ├── app.ts              # Main component
│   ├── app.html            # Component template
│   ├── app.scss            # Component styles
│   ├── constants.ts        # System prompt for AI
│   └── app.spec.ts         # Component tests
├── main.ts                 # Application entry point
└── styles.scss             # Global styles
```

## Key Components

- **[Api Service](src/app/api.ts)**: Handles communication with Google Generative AI
- **[App Component](src/app/app.ts)**: Main UI and content generation logic
- **[Constants](src/app/constants.ts)**: System prompt that guides AI behavior

## How It Works

The system uses a sophisticated prompt engineering approach to generate platform-specific content:

1. Analyzes the user's input for platform mentions
2. Determines the appropriate content format
3. Applies format-specific guidelines (hooks, CTAs, hashtags, etc.)
4. Streams the response in real-time for immediate feedback

## License

MIT License - feel free to use this project for personal and commercial purposes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

[Your Name](https://github.com/yourusername)

## Acknowledgments

- Built with [Angular](https://angular.dev)
- Powered by [Google Generative AI](https://ai.google.dev)
