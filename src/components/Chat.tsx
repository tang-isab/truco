import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types/game';

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

export function Chat({ messages, onSendMessage }: ChatProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="chat-container h-96 flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Chat</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 && (
          <div className="text-gray-500 text-sm text-center">No messages yet...</div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className="text-sm">
            <span className="font-semibold text-blue-600">{msg.playerName}:</span>
            <span className="ml-2">{msg.message}</span>
            <div className="text-xs text-gray-400">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="input flex-1"
            maxLength={200}
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}