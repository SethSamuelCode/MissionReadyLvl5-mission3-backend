'use client';

import Image from "next/image";
import { useState, useEffect, FormEvent } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [job, setJob] = useState('');
  const [uuid, setUuid] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch a new UUID on component mount
  useEffect(() => {
    fetch('/api/chat')
      .then(response => response.json())
      .then(data => setUuid(data.uuid));
  }, []);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userInput: input, 
          job, 
          uuid 
        }),
      });

      const data = await response.json();

      // Add AI response to chat
      const aiMessage: Message = { text: data.response, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { 
        text: 'Sorry, there was an error processing your message.', 
        sender: 'ai' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-gray-50 border-b">
          <h1 className="text-2xl font-bold text-gray-800">AI Interview Assistant</h1>
          <div className="mt-2 flex space-x-2">
            <input 
              type="text" 
              placeholder="Enter Job Title" 
              value={job}
              onChange={(e) => setJob(e.target.value)}
              className="flex-grow p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.sender === 'user' 
                  ? 'bg-blue-500 text-white self-end ml-auto' 
                  : 'bg-gray-200 text-gray-800 self-start mr-auto'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="text-gray-500 italic">Thinking...</div>
          )}
        </div>
        
        <form onSubmit={sendMessage} className="p-4 bg-gray-50 flex">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response..."
            className="flex-grow p-2 border rounded-l-lg"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
            disabled={isLoading || !job}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
