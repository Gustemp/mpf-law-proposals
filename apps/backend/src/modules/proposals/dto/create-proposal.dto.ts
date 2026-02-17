import { IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export enum ProposalStatus {
  DRAFT = 'DRAFT',
  BRIEFING = 'BRIEFING',
  REVIEW = 'REVIEW',
  STYLING = 'STYLING',
  LAYOUT = 'LAYOUT',
  COMPLETED = 'COMPLETED',
}

export class CreateProposalDto {
  @IsString()
  @MinLength(3, { message: 'Título deve ter no mínimo 3 caracteres' })
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsString()
  briefingId: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsString()
  styleId?: string;

  @IsOptional()
  @IsString()
  layoutId?: string;

  @IsOptional()
  @IsEnum(ProposalStatus)
  status?: ProposalStatus;
}
