import { IsString, IsBoolean, IsOptional, IsArray, IsInt } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateCrewDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  process?: string;

  @IsOptional()
  @IsBoolean()
  verbose?: boolean;

  @IsOptional()
  @IsBoolean()
  memory?: boolean;

  @IsOptional()
  @IsString()
  managerLlm?: string;

  @IsOptional()
  @IsInt()
  maxRpm?: number;

  @IsOptional()
  variables?: Prisma.InputJsonValue;

  @IsOptional()
  flowData?: Prisma.InputJsonValue;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  agentIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  taskIds?: string[];
}
