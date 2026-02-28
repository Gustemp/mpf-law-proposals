import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class CreateCrewTaskDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  expectedOutput: string;

  @IsOptional()
  @IsString()
  agentId?: string;

  @IsOptional()
  @IsBoolean()
  asyncExecution?: boolean;

  @IsOptional()
  @IsBoolean()
  humanInput?: boolean;

  @IsOptional()
  @IsString()
  outputFile?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  toolIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contextTaskIds?: string[];
}
