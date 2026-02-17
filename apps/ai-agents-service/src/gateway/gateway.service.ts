import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { OrchestratorService } from '../orchestrator/orchestrator.service';
import { AgentRequestDto } from './dto/agent-request.dto';

export type AgentType = 'briefing' | 'draft' | 'style' | 'layout';

export interface AgentResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  agentType: AgentType;
  output?: unknown;
  error?: string;
  metadata?: {
    tokensUsed: number;
    processingTime: number;
    provider: string;
    model: string;
  };
}

@Injectable()
export class GatewayService {
  private jobs: Map<string, AgentResponse> = new Map();

  constructor(private readonly orchestratorService: OrchestratorService) {}

  async processAgent(agentType: AgentType, request: AgentRequestDto): Promise<AgentResponse> {
    const jobId = uuidv4();
    const startTime = Date.now();

    const job: AgentResponse = {
      jobId,
      status: 'processing',
      agentType,
    };
    this.jobs.set(jobId, job);

    try {
      const result = await this.orchestratorService.executeAgent(agentType, request);

      const completedJob: AgentResponse = {
        ...job,
        status: 'completed',
        output: result.content,
        metadata: {
          tokensUsed: result.tokensUsed.total,
          processingTime: Date.now() - startTime,
          provider: result.provider,
          model: result.model,
        },
      };
      this.jobs.set(jobId, completedJob);
      return completedJob;
    } catch (error) {
      const failedJob: AgentResponse = {
        ...job,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      this.jobs.set(jobId, failedJob);
      return failedJob;
    }
  }

  async getJobStatus(jobId: string): Promise<AgentResponse | null> {
    return this.jobs.get(jobId) || null;
  }

  async runFullPipeline(request: AgentRequestDto): Promise<AgentResponse> {
    const jobId = uuidv4();
    const startTime = Date.now();

    const job: AgentResponse = {
      jobId,
      status: 'processing',
      agentType: 'briefing',
    };
    this.jobs.set(jobId, job);

    try {
      const result = await this.orchestratorService.runPipeline(request);

      const completedJob: AgentResponse = {
        ...job,
        status: 'completed',
        output: result,
        metadata: {
          tokensUsed: 0,
          processingTime: Date.now() - startTime,
          provider: 'pipeline',
          model: 'multi-agent',
        },
      };
      this.jobs.set(jobId, completedJob);
      return completedJob;
    } catch (error) {
      const failedJob: AgentResponse = {
        ...job,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      this.jobs.set(jobId, failedJob);
      return failedJob;
    }
  }
}
