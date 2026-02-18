import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateLayoutDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  config: Prisma.InputJsonValue;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
