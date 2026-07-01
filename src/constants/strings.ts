// src/constants/strings.ts

export const Strings = {
  appName: 'Nova',
  tagline: 'The future is here, powered by AI.',
  getStarted: 'Get Started',
  features: 'Features',
  assistant: 'Assistant',

  chatGPTTitle: 'ChatGPT',
  chatGPTDesc:
    'ChatGPT can provide you with instant and knowledgeable responses, assist you with creative ideas on a wide range of topics.',

  dalleTitle: 'DALL-E',
  dalleDesc:
    'DALL-E can generate imaginative and diverse images from textual descriptions, expanding the boundaries of visual creativity.',

  smartAITitle: 'Smart AI',
  smartAIDesc:
    'A powerful voice assistant with the abilities of ChatGPT and Dall-E, providing you the best of both worlds.',

  stop: 'Stop',
  clear: 'Clear',
  send: 'Send',

  listeningPlaceholder: 'Listening...',
  tapToSpeak: 'Tap the mic to speak',
  thinking: 'Thinking...',

  micPermissionError: 'Microphone permission is required to use voice features.',
  networkError: 'Network error. Please check your connection.',
  apiError: 'Something went wrong. Please try again.',
};

export const Config = {
  openAIBaseURL: 'https://api.openai.com/v1',
  openAIModel: 'gpt-3.5-turbo',
  maxTokens: 1024,
};