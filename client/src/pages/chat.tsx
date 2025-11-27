import React, { useState } from 'react';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { INITIAL_CHATS, Chat, CURRENT_USER } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(INITIAL_CHATS[0].id);
  const { toast } = useToast();

  const selectedChat = chats.find(c => c.id === selectedChatId);

  const handleSendMessage = (content: string) => {
    if (!selectedChatId) return;

    const newMessage = {
      id: `m-${Date.now()}`,
      senderId: CURRENT_USER.id,
      content,
      timestamp: new Date(),
      type: 'text' as const
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    }));

    // Simulate reply
    setTimeout(() => {
      setChats(prev => prev.map(chat => {
         if (chat.id === selectedChatId) return { ...chat, isTyping: true };
         return chat;
      }));
      
      setTimeout(() => {
         setChats(prev => prev.map(chat => {
           if (chat.id === selectedChatId) {
              return {
                ...chat,
                isTyping: false,
                messages: [...chat.messages, {
                  id: `m-r-${Date.now()}`,
                  senderId: chat.participants[0].id,
                  content: "This is a mock auto-reply! 👋",
                  timestamp: new Date(),
                  type: 'text' as const
                }]
              };
           }
           return chat;
         }));
      }, 2000);
    }, 1000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
      <div className="w-80 shrink-0 hidden md:block">
        <Sidebar 
          chats={chats} 
          selectedChatId={selectedChatId} 
          onSelectChat={setSelectedChatId} 
        />
      </div>
      
      <div className="flex-1 flex flex-col h-full relative">
        {selectedChat ? (
          <ChatArea 
            chat={selectedChat} 
            onSendMessage={handleSendMessage} 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
