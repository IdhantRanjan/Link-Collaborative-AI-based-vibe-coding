
import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  color: string;
}

interface ChatPanelProps {
  messages: Message[];
  currentUser: string;
  onSendMessage: (content: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, currentUser, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 border-l border-slate-200">
      {/* Chat Header */}
      <div className="flex items-center p-3 border-b border-slate-200 bg-white">
        <MessageCircle className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-sm font-medium text-slate-800">Team Chat</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 text-sm mt-8">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex space-x-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0 mt-1"
                style={{ backgroundColor: message.color }}
              >
                {message.user[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-slate-800">
                    {message.user}
                  </span>
                  <span className="text-xs text-slate-500">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-slate-700 break-words">
                  {message.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 text-sm"
          />
          <Button 
            size="sm" 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
