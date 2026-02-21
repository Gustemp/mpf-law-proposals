import { IsString, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @IsString()
  @IsOptional()
  openaiApiKey?: string;

  @IsString()
  @IsOptional()
  anthropicApiKey?: string;

  @IsString()
  @IsOptional()
  preferredModel?: string;
}
