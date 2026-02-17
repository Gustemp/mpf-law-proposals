import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { ILLMProvider, LLMOptions, LLMResponse, ChatMessage } from './provider.interface';

@Injectable()
export class AnthropicProvider implements ILLMProvider {
  private client: Anthropic;

  constructor(private configService: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.configService.get<string>('ANTHROPIC_API_KEY'),
    });
  }

  async generateCompletion(prompt: string, options?: LLMOptions): Promise<LLMResponse> {
    const messages: ChatMessage[] = [{ role: 'user', content: prompt }];
    return this.generateChat(messages, options);
  }

  async generateChat(messages: ChatMessage[], options?: LLMOptions): Promise<LLMResponse> {
    const model = options?.model || 'claude-3-sonnet-20240229';

    const systemMessage = messages.find((m) => m.role === 'system');
    const chatMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const response = await this.client.messages.create({
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
