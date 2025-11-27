# Pulse - Social Media Platform

A modern, full-featured social media application built with React, Vite, and Tailwind CSS. Features include messaging, photo feeds, vertical reels, user profiles, and settings management.

## Features

### 🏠 Home Feed
- Scrollable Instagram-style post feed
- Stories bar with user avatars
- Like, comment, and share functionality
- Suggested users recommendations

### 💬 Direct Messages
- Real-time chat interface
- User list with unread count badges
- Typing indicators
- Mock auto-replies for demo purposes

### 🎬 Reels
- Full-screen vertical video player
- Snap-scroll navigation
- Like, comment, and share metrics
- Music track display
- Volume controls

### 👤 User Profiles
- Bio and user statistics
- Post grid with hover effects
- Story highlights
- Tabs for Posts, Saved, and Tagged items

### ⚙️ Settings
- Account management
- Preferences (dark mode, notifications)
- Privacy controls

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 + custom CSS
- **UI Components**: shadcn/ui
- **Routing**: Wouter (lightweight router)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Formatting**: date-fns
- **State Management**: React Hooks

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the Vite dev server:

```bash
npm run dev:client
```

The app will be available at `http://localhost:5000`

### Production Build

```bash
npm run build
```

Output will be in `dist/public/`

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── chat/           # Chat components (Sidebar, ChatArea, MessageBubble)
│   │   ├── feed/           # Feed components (PostCard)
│   │   ├── layout/         # AppLayout (main navigation shell)
│   │   └── ui/             # shadcn/ui components
│   ├── pages/
│   │   ├── home.tsx        # Feed page
│   │   ├── chat.tsx        # Chat page
│   │   ├── reels.tsx       # Reels page
│   │   ├── profile.tsx     # Profile page
│   │   ├── settings.tsx    # Settings page
│   │   └── not-found.tsx
│   ├── lib/
│   │   ├── mock-data.ts    # Mock data and interfaces
│   │   └── utils.ts
│   ├── hooks/              # Custom React hooks
│   ├── App.tsx             # Main app router
│   └── index.css           # Design system tokens
└── index.html              # HTML entry point
```

## Design System

The app uses Tailwind CSS v4 with a modern violet/slate color palette:
- **Primary Color**: Violet (#9D4EDD)
- **Typography**: Space Grotesk (display) + Inter (body)
- **Border Radius**: 0.75rem base radius
- **Dark Mode**: Full support with CSS variables

## Mock Data

All data is currently stored in memory using React state. The app includes:
- 4 mock users with profiles
- 4 sample posts with images
- 3 sample reels with videos
- Chat conversations with simulated auto-replies

## Deployment

### Vercel (Recommended)

1. Push to GitHub: `https://github.com/KayongoRyan/chatsystem.git`
2. Import in Vercel dashboard
3. Deploy automatically

Vercel config is included in `vercel.json`

### Other Platforms

The `dist/public/` folder can be deployed to:
- Netlify
- GitHub Pages
- Any static hosting service

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-responsive design
- Touch-friendly UI for mobile devices

## Future Enhancements

- Real-time database integration
- User authentication
- Image/video uploads
- Backend API for persistence
- WebSocket for real-time messaging
- Push notifications

## License

MIT

## Author

Built with Replit Design System
