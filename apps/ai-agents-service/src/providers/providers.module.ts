import { Module } from '@nestjs/common';
import { OpenAIProvider } from './openai.provider';
import { AnthropicProvider } from './anthropic.provider';
import { ProviderFactory } from './provider.factory';

@Module({
  providers: [OpenAIProvider, AnthropicProvider, ProviderFactory],
  exports: [ProviderFactory],
})
export class ProvidersModule {}
