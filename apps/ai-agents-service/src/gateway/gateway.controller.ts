import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { AgentRequestDto } from './dto/agent-request.dto';

@Controller('api/v1/agents')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post('briefing')
  async processBriefing(@Body() request: AgentRequestDto) {
    return this.gatewayService.processAgent('briefing', request);
  }

  @Post('draft')
  async processDraft(@Body() request: AgentRequestDto) {
    return this.gatewayService.processAgent('draft', request);
  }

  @Post('style')
  async processStyle(@Body() request: AgentRequestDto) {
    return this.gatewayService.processAgent('style', request);
  }

  @Post('layout')
  async processLayout(@Body() request: AgentRequestDto) {
    return this.gatewayService.processAgent('layout', request);
  }

  @Get('status/:jobId')
  async getJobStatus(@Param('jobId') jobId: string) {
    return this.gatewayService.getJobStatus(jobId);
  }

  @Post('pipeline')
  async runFullPipeline(@Body() request: AgentRequestDto) {
    return this.gatewayService.runFullPipeline(request);
  }
}
