import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Zap, Target, Clock, Flame } from 'lucide-react';
import { ChatMessage, DailyPlan } from '../types';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: DailyPlan | null;
}

export function ChatBox({ isOpen, onClose, currentPlan }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Your tactical advisor is online. How shall we crush today\'s objectives, my lord?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Gemini API call for chat response
    try {
      let context = '';
      if (currentPlan) {
        context = `Today's plan: ${JSON.stringify(currentPlan)}`;
      }
      const prompt = `${context}\nUser: ${inputMessage.trim()}\nRespond as a tactical Sith advisor: concise, direct, and menacing. Avoid pleasantries.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'text/plain',
        },
      });
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.text ?? 'The dark side is silent. Try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: 'The dark side is silent. Try again.',
        timestamp: new Date().toISOString()
      }]);
      console.error('Gemini API error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: Target, text: 'Focus strategy', action: 'How can I stay focused on my critical tasks?' },
    { icon: Clock, text: 'Time optimization', action: 'Help me optimize my schedule for maximum efficiency.' },
    { icon: Flame, text: 'Motivation boost', action: 'I need motivation to push through resistance.' },
    { icon: Zap, text: 'Overcome obstacle', action: 'I\'m facing an obstacle. Help me destroy it.' }
  ];

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full lg:w-96 bg-gradient-to-b from-gray-900 via-black to-red-950/20 border-l border-red-900/50 transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } flex flex-col`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-red-900/50">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-red-400 tracking-wide">TACTICAL ADVISOR</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-900/30 rounded-md transition-colors duration-200"
          >
            <X className="w-5 h-5 text-red-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-red-900/50 text-white border border-red-700/50'
                    : 'bg-gray-900/80 text-gray-100 border border-gray-700/50'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span className="text-xs text-gray-400 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-900/80 text-gray-100 border border-gray-700/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                  <span className="text-xs text-gray-400">Analyzing tactical options...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 2 && (
          <div className="p-4 border-t border-red-900/30">
            <p className="text-red-300 text-sm font-medium mb-3">Quick Commands:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  className="flex items-center gap-2 p-2 bg-red-950/30 hover:bg-red-950/50 border border-red-800/30 rounded-md transition-all duration-200 text-left"
                >
                  <action.icon className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-gray-300">{action.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-red-900/50">
          <div className="flex gap-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Command your tactical advisor..."
              className="flex-1 bg-gray-900/50 border border-red-800/30 rounded-md px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none h-10"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 disabled:from-gray-800 disabled:to-gray-700 text-white p-2 rounded-md transition-all duration-200 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}