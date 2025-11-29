import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

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
    <div className="w-full bg-background border-t border-border p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
          data-testid="input-message"
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          data-testid="button-send"
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
