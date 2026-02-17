export interface ILLMProvider {
  generateCompletion(prompt: string, options?: LLMOptions): Promise<LLMResponse>;
  generateChat(messages: ChatMessage[], options?: LLMOptions): Promise<LLMResponse>;
}

export interface LLMOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  model: string;
  provider: string;
}
