// src/api/openai.ts
import axios from 'axios';
import { Config } from '../constants/strings';
import { OPENAI_API_KEY } from '@env';


const openAIClient = axios.create({
  baseURL: Config.openAIBaseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  },
  timeout: 30000,
});

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  text: string;
  error?: string;
}

const systemMessage: Message = {
  role: 'system',
  content:
    'You are Nova, a helpful and friendly AI voice assistant. Keep your responses concise, clear, and conversational since they will be spoken aloud. Avoid using markdown formatting, bullet points, or special characters in your responses.',
};

export async function sendMessage(
  messages: Message[],
): Promise<ChatResponse> {
  try {
    const response = await openAIClient.post('/chat/completions', {
      model: Config.openAIModel,
      messages: [systemMessage, ...messages],
      max_tokens: Config.maxTokens,
      temperature: 0.7,
    });

    const text = response.data.choices[0]?.message?.content?.trim();
    if (!text) {
      return { text: '', error: 'Empty response from AI.' };
    }
    return { text };
  } catch (error: any) {
    console.error('OpenAI API error:', error?.response?.data || error.message);
    if (error?.response?.status === 401) {
      return { text: '', error: 'Invalid API key. Please check your configuration.' };
    }
    if (error?.response?.status === 429) {
      return { text: '', error: 'Rate limit exceeded. Please wait and try again.' };
    }
    return { text: '', error: 'Failed to get response. Please try again.' };
  }
}

export async function generateImage(prompt: string): Promise<{ url?: string; error?: string }> {
  try {
    const response = await openAIClient.post('/images/generations', {
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
    });
    const url = response.data.data[0]?.url;
    return { url };
  } catch (error: any) {
    console.error('DALL-E API error:', error?.response?.data || error.message);
    return { error: 'Failed to generate image. Please try again.' };
  }
}
