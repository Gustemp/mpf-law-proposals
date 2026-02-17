import { IsString, IsOptional, IsObject } from 'class-validator';

export class AgentConfigDto {
  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  temperature?: number;

  @IsOptional()
  maxTokens?: number;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsString()
  styleId?: string;

  @IsOptional()
  @IsString()
  layoutId?: string;
}

export class AgentContextDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  proposalId?: string;

  @IsOptional()
  @IsString()
  briefingId?: string;

  @IsOptional()
  @IsObject()
  previousOutputs?: Record<string, unknown>;
}

export class AgentRequestDto {
  @IsString()
  input: string;

  @IsOptional()
  @IsObject()
  config?: AgentConfigDto;

  @IsOptional()
  @IsObject()
  context?: AgentContextDto;
}
