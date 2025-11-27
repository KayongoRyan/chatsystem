export interface User {
  id: string;
  name: string;
  avatar: string;
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
  participants: User[]; // For DM, usually 1 other person + current user
  messages: Message[];
  unreadCount: number;
  isTyping?: boolean;
}

export const CURRENT_USER: User = {
  id: 'me',
  name: 'You',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
  status: 'online'
};

export const USERS: User[] = [
  {
    id: 'u1',
    name: 'Sarah Wilson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    status: 'online'
  },
  {
    id: 'u2',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    status: 'busy'
  },
  {
    id: 'u3',
    name: 'Emma Thompson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 30) // 30 mins ago
  },
  {
    id: 'u4',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    status: 'online'
  }
];

const generateMessages = (count: number, participants: User[]): Message[] => {
  const messages: Message[] = [];
  const senders = [...participants, CURRENT_USER];
  const texts = [
    "Hey, how are you doing?",
    "Just finished that project we discussed.",
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

  let time = new Date(Date.now() - 1000 * 60 * 60 * 24); // Start 24 hours ago

  for (let i = 0; i < count; i++) {
    const sender = senders[Math.floor(Math.random() * senders.length)];
    time = new Date(time.getTime() + Math.random() * 1000 * 60 * 60); // Add random time up to 1 hour
    
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
