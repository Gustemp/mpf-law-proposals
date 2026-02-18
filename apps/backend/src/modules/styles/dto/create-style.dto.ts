import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class CreateStyleDto {
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
