# 🤖 ScriptWeaver - Content Generator

ScriptWeaver is an intelligent content generation tool powered by Google's Gemini AI. It helps creators generate engaging, platform-optimized scripts and content for various social media platforms.

## Features

- 🎬 **Multi-Platform Support**: Generate content tailored for Instagram, YouTube, TikTok, X/Twitter, LinkedIn, and more
- 🚀 **Smart Content Optimization**: AI-powered system that analyzes your topic and creates viral-ready content
- ⚡ **Real-time Streaming**: Watch content generate in real-time as the AI thinks
- 📝 **Format-Specific Generation**:
  - Short-form video scripts (Reels, TikTok, Shorts)
  - Long-form tutorial scripts (YouTube)
  - Social media posts (Twitter, LinkedIn, Instagram captions)
  - AI avatar scripts with stage directions
- 🎨 **Modern UI**: Clean, responsive design with dark theme
- ♿ **Accessible**: Built with accessibility best practices

## Tech Stack

- **Framework**: Angular 21
- **Language**: TypeScript 5.9
- **AI**: Google Generative AI (Gemini 2.5 Flash)
- **Styling**: SCSS
- **Testing**: Vitest
- **Build Tool**: Angular CLI

## Getting Started

### Prerequisites

- Node.js 18+ and npm 11.6.2+
- Google Generative AI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/scriptweaver.git
cd scriptweaver

# Install dependencies
npm install
```

### Configuration

1. Get your API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Update the API key in `src/app/api.ts`:

```typescript
private apiKey = 'YOUR_API_KEY_HERE';
```

### Development

```bash
# Start development server
npm start
# Navigate to http://localhost:4200/
```

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
