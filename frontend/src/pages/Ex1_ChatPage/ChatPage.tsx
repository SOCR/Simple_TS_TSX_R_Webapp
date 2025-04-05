import React, { useState, FormEvent, useRef, useEffect } from 'react';
import openaiApiClient, { ChatMessage } from '../../services/openaiApiClient';

const ChatPage: React.FC = () => {
  // State for chat messages and user input
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'system', content: 'You are a helpful assistant.' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the most recent message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Add user message to state
    const userMessage: ChatMessage = { role: 'user', content: userInput };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setUserInput('');
    setIsLoading(true);
    
    try {
      // Send messages to OpenAI
      const allMessages = [...messages, userMessage];
      const response = await openaiApiClient.sendMessage(allMessages);
      
      // Add assistant response to state
      const assistantMessage: ChatMessage = { role: 'assistant', content: response };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Failed to get response:', error);
      // Add error message
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Simple LLM Chat</h1>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.filter(m => m.role !== 'system').map((message, index) => (
          <div 
            key={index} 
            className={`max-w-3/4 p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-indigo-100 ml-auto' 
                : 'bg-white mr-auto'
            }`}
          >
            <div className="font-semibold text-xs text-gray-500">
              {message.role === 'user' ? 'You' : 'Assistant'}
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="bg-white p-3 rounded-lg mr-auto">
            <div className="font-semibold text-xs text-gray-500">Assistant</div>
            <div className="animate-pulse">Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPage; 