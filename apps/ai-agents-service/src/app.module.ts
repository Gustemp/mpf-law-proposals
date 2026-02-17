import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { GatewayModule } from './gateway/gateway.module';
import { OrchestratorModule } from './orchestrator/orchestrator.module';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    GatewayModule,
    OrchestratorModule,
    ProvidersModule,
  ],
})
export class AppModule {}
