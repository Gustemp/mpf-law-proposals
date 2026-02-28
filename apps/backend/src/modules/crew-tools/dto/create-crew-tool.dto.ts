import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateCrewToolDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  parameters?: Prisma.InputJsonValue;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
