
import React, { useState } from 'react';
import { Bot, Send, Sparkles, Code, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AICopilotProps {
  currentCode: string;
  language: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AICopilot: React.FC<AICopilotProps> = ({ currentCode, language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI coding assistant. I can help you debug code, explain concepts, or suggest improvements. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickActions = [
    { icon: Code, label: 'Explain this code', action: 'explain' },
    { icon: HelpCircle, label: 'Find bugs', action: 'debug' },
    { icon: Sparkles, label: 'Optimize code', action: 'optimize' },
  ];

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || input.trim();
    if (!messageToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Using a free AI service (you can replace with any free API)
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || 'demo-key'}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful coding assistant. The user is working with ${language} code. Current code context: ${currentCode.slice(0, 500)}...`
            },
            {
              role: 'user',
              content: messageToSend
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      let aiResponse = "I'm a demo AI assistant. For full functionality, please add your OpenAI API key to the environment variables. I can still help with basic coding questions!";
      
      if (response.ok) {
        const data = await response.json();
        aiResponse = data.choices[0].message.content;
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI API error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm currently in demo mode. To get AI-powered responses, please add your OpenAI API key to the environment variables.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    const prompts = {
      explain: `Can you explain what this ${language} code does?\n\n\`\`\`${language}\n${currentCode}\n\`\`\``,
      debug: `Can you help me find any bugs or issues in this ${language} code?\n\n\`\`\`${language}\n${currentCode}\n\`\`\``,
      optimize: `How can I optimize or improve this ${language} code?\n\n\`\`\`${language}\n${currentCode}\n\`\`\``
    };
    handleSendMessage(prompts[action as keyof typeof prompts]);
  };

  return (
    <div className="h-full flex flex-col bg-slate-800/30 backdrop-blur">
      {/* Header */}
      <div className="flex items-center p-3 border-b border-slate-700 bg-slate-800/50">
        <Bot className="w-5 h-5 text-purple-400 mr-2" />
        <h3 className="text-sm font-medium text-white">AI Copilot</h3>
        <div className="ml-auto">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-slate-700/50">
        <div className="grid grid-cols-1 gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.action)}
              className="flex items-center px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <action.icon className="w-4 h-4 mr-2" />
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 text-slate-200'
            }`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-700 bg-slate-800/50">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder="Ask me anything about coding..."
            className="flex-1 text-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            disabled={isLoading}
          />
          <Button 
            size="sm" 
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AICopilot;
