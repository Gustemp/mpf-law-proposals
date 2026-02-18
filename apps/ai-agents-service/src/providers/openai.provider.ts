import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ILLMProvider, LLMOptions, LLMResponse, ChatMessage } from './provider.interface';

@Injectable()
export class OpenAIProvider implements ILLMProvider {
  private client: OpenAI | null = null;
  private userApiKeys: Map<string, OpenAI> = new Map();

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    }
  }

  setApiKey(userId: string, apiKey: string): void {
    this.userApiKeys.set(userId, new OpenAI({ apiKey }));
  }

  private getClient(userId?: string): OpenAI {
    if (userId && this.userApiKeys.has(userId)) {
      return this.userApiKeys.get(userId)!;
    }
    if (!this.client) {
      throw new Error('OpenAI API key not configured. Please provide your API key in settings.');
    }
    return this.client;
  }

  async generateCompletion(prompt: string, options?: LLMOptions): Promise<LLMResponse> {
    const messages: ChatMessage[] = [];
    
    if (options?.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    return this.generateChat(messages, options);
  }

  async generateChat(messages: ChatMessage[], options?: LLMOptions): Promise<LLMResponse> {
    const client = this.getClient(options?.userId);
    const model = options?.model || this.configService.get<string>('DEFAULT_AI_MODEL') || 'gpt-4-turbo-preview';

    const response = await client.chat.completions.create({
      model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
    });

    return {
      content: response.choices[0]?.message?.content || '',
      tokensUsed: {
        prompt: response.usage?.prompt_tokens || 0,
        completion: response.usage?.completion_tokens || 0,
        total: response.usage?.total_tokens || 0,
      },
      model,
      provider: 'openai',
    };
  }
}
