import { IsString, IsBoolean, IsInt, IsOptional, IsArray } from 'class-validator';

export class CreateCrewAgentDto {
  @IsString()
  name: string;

  @IsString()
  role: string;

  @IsString()
  goal: string;

  @IsString()
  backstory: string;

  @IsOptional()
  @IsString()
  llmProvider?: string;

  @IsOptional()
  @IsString()
  llmModel?: string;

  @IsOptional()
  @IsBoolean()
  verbose?: boolean;

  @IsOptional()
  @IsBoolean()
  allowDelegation?: boolean;

  @IsOptional()
  @IsInt()
  maxIter?: number;

  @IsOptional()
  @IsBoolean()
  memory?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  toolIds?: string[];
}
