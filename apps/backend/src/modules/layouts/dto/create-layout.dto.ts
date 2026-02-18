import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class CreateLayoutDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  config: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
