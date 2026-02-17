import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { OrchestratorModule } from '../orchestrator/orchestrator.module';

@Module({
  imports: [OrchestratorModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
