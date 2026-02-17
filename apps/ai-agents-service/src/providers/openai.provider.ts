import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ILLMProvider, LLMOptions, LLMResponse, ChatMessage } from './provider.interface';

@Injectable()
export class OpenAIProvider implements ILLMProvider {
  private client: OpenAI;

  constructor(private configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
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
    const model = options?.model || this.configService.get<string>('DEFAULT_AI_MODEL') || 'gpt-4-turbo-preview';

    const response = await this.client.chat.completions.create({
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
