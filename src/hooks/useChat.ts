// src/hooks/useChat.ts
import { useState, useCallback } from 'react';
import { sendMessage, Message } from '../api/openai';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendUserMessage: (text: string) => Promise<string | null>;
  clearMessages: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendUserMessage = useCallback(async (text: string): Promise<string | null> => {
    if (!text.trim() || isLoading) return null;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);
    setError(null);

    // Build message history for context
    const history: Message[] = messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content,
    }));
    history.push({ role: 'user', content: text.trim() });

    const response = await sendMessage(history);

    setIsLoading(false);

    if (response.error) {
      setError(response.error);
      setMessages(prev => prev.filter(m => !m.isLoading));
      return null;
    }

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 2).toString(),
      role: 'assistant',
      content: response.text,
      timestamp: new Date(),
    };

    setMessages(prev => [
      ...prev.filter(m => !m.isLoading),
      assistantMessage,
    ]);

    return response.text;
  }, [messages, isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendUserMessage, clearMessages };
}
