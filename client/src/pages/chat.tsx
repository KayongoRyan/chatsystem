import React, { useState, useCallback } from 'react';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { MessageComposer } from '@/components/MessageComposer';
import { CallInterface } from '@/components/CallInterface';
import { INITIAL_CHATS, Chat, CURRENT_USER } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { useCallSocket } from '@/hooks/useCallSocket';

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(INITIAL_CHATS[0].id);
  const { toast } = useToast();
  const { activeCall, incomingCall, initiateCall, answerCall, rejectCall, endCall } = useCallSocket(CURRENT_USER.id);

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

  const handleStartCall = useCallback((type: 'audio' | 'video') => {
    if (!selectedChat?.participants[0]) return;
    const recipientId = selectedChat.participants[0].id;
    initiateCall(recipientId, type);
    toast({ title: "Calling...", description: `${type} call initiated` });
  }, [selectedChat, initiateCall, toast]);

  const handleAcceptCall = useCallback(() => {
    answerCall();
    toast({ title: "Call accepted" });
  }, [answerCall, toast]);

  const handleRejectCall = useCallback(() => {
    rejectCall();
    toast({ title: "Call rejected" });
  }, [rejectCall, toast]);

  const handleEndCall = useCallback(() => {
    endCall();
    toast({ title: "Call ended" });
  }, [endCall, toast]);

  // Show incoming call modal
  if (incomingCall) {
    const caller = INITIAL_CHATS.flatMap(c => c.participants).find(p => p.id === incomingCall.from);
    return (
      <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Incoming {incomingCall.type} Call</h2>
          <p className="text-gray-300 mb-8">{caller?.name || 'Unknown'}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRejectCall}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold"
            >
              Decline
            </button>
            <button
              onClick={handleAcceptCall}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show active call interface
  if (activeCall) {
    const recipient = selectedChat?.participants[0];
    return (
      <CallInterface
        recipientName={recipient?.name || 'Unknown'}
        recipientAvatar={recipient?.avatar || ''}
        callStatus={activeCall.status}
        callType={activeCall.type}
        onEndCall={handleEndCall}
        onToggleMic={() => {}}
        onToggleVideo={() => {}}
      />
    );
  }

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
              onStartAudioCall={() => handleStartCall('audio')}
              onStartVideoCall={() => handleStartCall('video')}
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
