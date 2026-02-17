import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIProvider } from './openai.provider';
import { AnthropicProvider } from './anthropic.provider';
import { ILLMProvider } from './provider.interface';

@Injectable()
export class ProviderFactory {
  constructor(
    private configService: ConfigService,
    private openaiProvider: OpenAIProvider,
    private anthropicProvider: AnthropicProvider,
  ) {}

  getProvider(providerName?: string): ILLMProvider {
    const provider = providerName || this.configService.get<string>('DEFAULT_AI_PROVIDER') || 'openai';

    switch (provider.toLowerCase()) {
      case 'anthropic':
      case 'claude':
        return this.anthropicProvider;
      case 'openai':
      case 'gpt':
      default:
        return this.openaiProvider;
    }
  }
}
