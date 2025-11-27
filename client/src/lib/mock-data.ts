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

export const POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    imageUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&auto=format&fit=crop&q=60',
    caption: 'Chasing sunsets in Bali 🌅 #travel #wanderlust',
    likes: 1243,
    comments: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    location: 'Bali, Indonesia'
  },
  {
    id: 'p2',
    userId: 'u3',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=60',
    caption: 'New piece in progress. Acrylic on canvas. 🎨',
    likes: 892,
    comments: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    location: 'Brooklyn Art Studio'
  },
  {
    id: 'p3',
    userId: 'u2',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
    caption: 'Late night coding session. The flow is real. 💻',
    likes: 456,
    comments: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: 'p4',
    userId: 'u1',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=60',
    caption: 'Cinque Terre vibes 🇮🇹',
    likes: 2341,
    comments: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    location: 'Cinque Terre, Italy'
  }
];

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
