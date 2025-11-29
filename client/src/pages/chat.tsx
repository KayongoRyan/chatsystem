import React, { useState, useCallback } from 'react';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { MessageComposer } from '@/components/MessageComposer';
import { INITIAL_CHATS, Chat, CURRENT_USER } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(INITIAL_CHATS[0].id);
  const { toast } = useToast();

  const selectedChat = chats.find(c => c.id === selectedChatId);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!selectedChatId) return;

    const recipientId = selectedChat?.participants[0].id;
    if (!recipientId) return;

    // Optimistically add message to UI
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

    // Send to API
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId, content })
      });
      
      if (!response.ok) {
        toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error", variant: "destructive" });
    }

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
  }, [selectedChatId, selectedChat, toast]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
      <div className="w-80 shrink-0 hidden md:block">
        <Sidebar 
          chats={chats} 
          selectedChatId={selectedChatId} 
          onSelectChat={setSelectedChatId} 
        />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {selectedChat ? (
          <>
            <ChatArea 
              chat={selectedChat} 
              onSendMessage={handleSendMessage} 
            />
            <div className="shrink-0 border-t border-border">
              <MessageComposer onSendMessage={handleSendMessage} />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
