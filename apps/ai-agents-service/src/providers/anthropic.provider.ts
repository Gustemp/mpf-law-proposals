import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { ILLMProvider, LLMOptions, LLMResponse, ChatMessage } from './provider.interface';

@Injectable()
export class AnthropicProvider implements ILLMProvider {
  private client: Anthropic | null = null;
  private userApiKeys: Map<string, Anthropic> = new Map();

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    if (apiKey) {
      this.client = new Anthropic({ apiKey });
    }
  }

  setApiKey(userId: string, apiKey: string): void {
    this.userApiKeys.set(userId, new Anthropic({ apiKey }));
  }

  private getClient(userId?: string): Anthropic {
    if (userId && this.userApiKeys.has(userId)) {
      return this.userApiKeys.get(userId)!;
    }
    if (!this.client) {
      throw new Error('Anthropic API key not configured. Please provide your API key in settings.');
    }
    return this.client;
  }

  async generateCompletion(prompt: string, options?: LLMOptions): Promise<LLMResponse> {
    const messages: ChatMessage[] = [{ role: 'user', content: prompt }];
    return this.generateChat(messages, options);
  }

  async generateChat(messages: ChatMessage[], options?: LLMOptions): Promise<LLMResponse> {
    const client = this.getClient(options?.userId);
    const model = options?.model || 'claude-3-sonnet-20240229';

    const systemMessage = messages.find((m) => m.role === 'system');
    const chatMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const response = await client.messages.create({
      model,
      max_tokens: options?.maxTokens ?? 4096,
      system: systemMessage?.content || options?.systemPrompt,
      messages: chatMessages,
    });

    const content = response.content[0]?.type === 'text' ? response.content[0].text : '';

    return {
      content,
      tokensUsed: {
        prompt: response.usage?.input_tokens || 0,
        completion: response.usage?.output_tokens || 0,
        total: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
      },
      model,
      provider: 'anthropic',
    };
  }
}
