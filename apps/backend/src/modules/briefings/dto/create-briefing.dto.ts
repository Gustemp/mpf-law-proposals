import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateBriefingDto {
  @IsString()
  @MinLength(3, { message: 'Título deve ter no mínimo 3 caracteres' })
  title: string;

  @IsString()
  @MinLength(10, { message: 'Conteúdo deve ter no mínimo 10 caracteres' })
  content: string;

  @IsOptional()
  @IsString()
  rawInput?: string;
}
