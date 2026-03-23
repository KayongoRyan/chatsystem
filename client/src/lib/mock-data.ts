export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  postsCount: number;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image';
  imageUrl?: string;
}

export interface Chat {
  id: string;
  participants: User[]; 
  messages: Message[];
  unreadCount: number;
  isTyping?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  likes: number;
}

export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: Date;
  location?: string;
}

export interface Reel {
  id: string;
  userId: string;
  videoUrl: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  musicTrack?: string;
}

export const CURRENT_USER: User = {
  id: 'me',
  name: 'You',
  username: 'design_enthusiast',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
  bio: 'Digital explorer | UI/UX | Coffee addict ☕️',
  followers: 1240,
  following: 450,
  postsCount: 42,
  status: 'online'
};

export const USERS: User[] = [
  {
    id: 'u1',
    name: 'Sarah Wilson',
    username: 'sarah_w',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    bio: 'Travel & Photography 📸',
    followers: 3421,
    following: 200,
    postsCount: 156,
    status: 'online'
  },
  {
    id: 'u2',
    name: 'Marcus Chen',
    username: 'marcus_codes',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    bio: 'Building the future 🚀',
    followers: 892,
    following: 500,
    postsCount: 23,
    status: 'busy'
  },
  {
    id: 'u3',
    name: 'Emma Thompson',
    username: 'emma_art',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    bio: 'Artist based in NYC 🎨',
    followers: 12500,
    following: 150,
    postsCount: 890,
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: 'u4',
    name: 'Alex Rivera',
    username: 'arivera',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    bio: 'Just vibing',
    followers: 420,
    following: 420,
    postsCount: 10,
    status: 'online'
  }
];

const generateMessages = (count: number, participants: User[]): Message[] => {
  const messages: Message[] = [];
  const senders = [...participants, CURRENT_USER];
  const texts = [
    "Hey, how are you doing?",
    "Just saw your latest post! 🔥",
    "Can you send me the files?",
    "Sure, give me a sec.",
    "Here you go!",
    "Thanks! Looks great.",
    "Lunch later?",
    "Absolutely. 12:30?",
    "Perfect.",
    "See you then!",
    "Did you see the new design updates?",
    "Not yet, are they on Figma?",
    "Yes, check the 'v2' page.",
    "On it."
  ];

  let time = new Date(Date.now() - 1000 * 60 * 60 * 24); 

  for (let i = 0; i < count; i++) {
    const sender = senders[Math.floor(Math.random() * senders.length)];
    time = new Date(time.getTime() + Math.random() * 1000 * 60 * 60);
    
    messages.push({
      id: `m-${Math.random().toString(36).substr(2, 9)}`,
      senderId: sender.id,
      content: texts[Math.floor(Math.random() * texts.length)],
      timestamp: time,
      type: 'text'
    });
  }

  return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

export const INITIAL_CHATS: Chat[] = USERS.map(user => ({
  id: `chat-${user.id}`,
  participants: [user],
  messages: generateMessages(Math.floor(Math.random() * 10) + 5, [user]),
  unreadCount: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0,
}));

/**
 * High-res square crops (1080×1080) from Unsplash — use for feed preview when the DB is empty
 * so the home layout always shows how real photo posts will look.
 */
const unsplashSquare = (photoId: string, params?: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1080&h=1080&q=90${params ? `&${params}` : ""}`;

export const POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    imageUrl: unsplashSquare('photo-1507525428034-b723cf961d3e'),
    caption: 'Golden hour at the coast — nothing beats this light 🌅 #travel #ocean',
    likes: 1243,
    comments: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    location: 'Malibu, CA'
  },
  {
    id: 'p2',
    userId: 'u3',
    imageUrl: unsplashSquare('photo-1549880338-65ddcdfd9b0e'),
    caption: 'Peaks above the clouds. Worth every step ⛰️',
    likes: 2104,
    comments: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    location: 'Swiss Alps'
  },
  {
    id: 'p3',
    userId: 'u2',
    imageUrl: unsplashSquare('photo-1498050108023-c5249f4df085'),
    caption: 'Shipping features tonight. Dark mode + coffee = flow state 💻',
    likes: 892,
    comments: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    location: 'Home office'
  },
  {
    id: 'p4',
    userId: 'u4',
    imageUrl: unsplashSquare('photo-1514565131-fce0801e5785'),
    caption: 'City lights never get old 🌃',
    likes: 3421,
    comments: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14),
    location: 'Tokyo'
  },
  {
    id: 'p5',
    userId: 'u1',
    imageUrl: unsplashSquare('photo-1540189549336-e6a99b367936'),
    caption: 'Brunch spread with the crew 🥗',
    likes: 756,
    comments: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22),
    location: 'SoHo, NYC'
  },
  {
    id: 'p6',
    userId: 'u3',
    imageUrl: unsplashSquare('photo-1579783902614-a3fb3927b6a5'),
    caption: 'Fresh strokes on the easel — work in progress 🎨',
    likes: 1532,
    comments: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30),
    location: 'Studio'
  }
];

/** Same posts with fresh timestamps (for preview mode) */
export function getPreviewFeedPosts(): Post[] {
  const offsets = [0.5, 2, 5, 12, 20, 36].map((h) => 1000 * 60 * 60 * h);
  return POSTS.map((p, i) => ({
    ...p,
    timestamp: new Date(Date.now() - (offsets[i] ?? offsets[0]))
  }));
}

// Using placeholder videos or images that look like video thumbnails for reels mock
export const REELS: Reel[] = [
  {
    id: 'r1',
    userId: 'u4',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    caption: 'Morning waves 🌊',
    likes: 5400,
    comments: 120,
    shares: 45,
    musicTrack: 'Ocean Sounds - Nature'
  },
  {
    id: 'r2',
    userId: 'u1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
    caption: 'Spring is here! 🌸',
    likes: 12000,
    comments: 342,
    shares: 890,
    musicTrack: 'Vivaldi - Spring'
  },
  {
    id: 'r3',
    userId: 'u3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-209-large.mp4',
    caption: 'Art process... wait for it',
    likes: 8900,
    comments: 230,
    shares: 120,
    musicTrack: 'Lofi Beats - Chill'
  }
];
