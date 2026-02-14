import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export enum Role {
  ADMIN = 'ADMIN',
  COLLABORATOR = 'COLLABORATOR',
}

export class CreateUserDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsString()
  @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
  name: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role deve ser ADMIN ou COLLABORATOR' })
  role?: Role;
}
