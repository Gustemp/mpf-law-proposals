import { Injectable } from '@nestjs/common';
import { BriefingAgent } from '../agents/briefing/briefing.agent';
import { DraftAgent } from '../agents/draft/draft.agent';
import { StyleAgent } from '../agents/style/style.agent';
import { LayoutAgent } from '../agents/layout/layout.agent';
import { AgentRequestDto } from '../gateway/dto/agent-request.dto';
import { LLMResponse } from '../providers/provider.interface';

export type AgentType = 'briefing' | 'draft' | 'style' | 'layout';

export interface PipelineResult {
  briefing: string;
  draft: string;
  styled: string;
  layout: string;
}

@Injectable()
export class OrchestratorService {
  constructor(
    private readonly briefingAgent: BriefingAgent,
    private readonly draftAgent: DraftAgent,
    private readonly styleAgent: StyleAgent,
    private readonly layoutAgent: LayoutAgent,
  ) {}

  async executeAgent(agentType: AgentType, request: AgentRequestDto): Promise<LLMResponse> {
    switch (agentType) {
      case 'briefing':
        return this.briefingAgent.execute(request);
      case 'draft':
        return this.draftAgent.execute(request);
      case 'style':
        return this.styleAgent.execute(request);
      case 'layout':
        return this.layoutAgent.execute(request);
      default:
        throw new Error(`Unknown agent type: ${agentType}`);
    }
  }

  async runPipeline(request: AgentRequestDto): Promise<PipelineResult> {
    // Step 1: Generate Briefing
    const briefingResult = await this.briefingAgent.execute(request);

    // Step 2: Generate Draft from Briefing
    const draftRequest: AgentRequestDto = {
      input: briefingResult.content,
      config: request.config,
      context: {
        ...request.context,
        previousOutputs: { briefing: briefingResult.content },
      },
    };
    const draftResult = await this.draftAgent.execute(draftRequest);

    // Step 3: Apply Style to Draft
    const styleRequest: AgentRequestDto = {
      input: draftResult.content,
      config: request.config,
      context: {
        ...request.context,
        previousOutputs: {
          briefing: briefingResult.content,
          draft: draftResult.content,
        },
      },
    };
    const styleResult = await this.styleAgent.execute(styleRequest);

    // Step 4: Apply Layout
    const layoutRequest: AgentRequestDto = {
      input: styleResult.content,
      config: request.config,
      context: {
        ...request.context,
        previousOutputs: {
          briefing: briefingResult.content,
          draft: draftResult.content,
          styled: styleResult.content,
        },
      },
    };
    const layoutResult = await this.layoutAgent.execute(layoutRequest);

    return {
      briefing: briefingResult.content,
      draft: draftResult.content,
      styled: styleResult.content,
      layout: layoutResult.content,
    };
  }
}
