import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Smile } from 'lucide-react';

interface MessageComposerProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function MessageComposer({ onSendMessage, disabled }: MessageComposerProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="w-full bg-card/80 backdrop-blur-sm border-t border-border p-4 shrink-0">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            disabled={disabled}
            className="h-10 w-10 rounded-full text-muted-foreground hover:text-primary"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={disabled}
            data-testid="input-message"
            className="flex-1 h-10 px-4 rounded-full border-border"
          />
          
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            disabled={disabled}
            className="h-10 w-10 rounded-full text-muted-foreground hover:text-primary"
          >
            <Smile className="w-5 h-5" />
          </Button>
          
          <Button
            type="submit"
            disabled={!message.trim() || disabled}
            data-testid="button-send"
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
