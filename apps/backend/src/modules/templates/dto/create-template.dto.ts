import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  content: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
