import { Module } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { ProvidersModule } from '../providers/providers.module';
import { BriefingAgent } from '../agents/briefing/briefing.agent';
import { DraftAgent } from '../agents/draft/draft.agent';
import { StyleAgent } from '../agents/style/style.agent';
import { LayoutAgent } from '../agents/layout/layout.agent';

@Module({
  imports: [ProvidersModule],
  providers: [
    OrchestratorService,
    BriefingAgent,
    DraftAgent,
    StyleAgent,
    LayoutAgent,
  ],
  exports: [OrchestratorService],
})
export class OrchestratorModule {}
