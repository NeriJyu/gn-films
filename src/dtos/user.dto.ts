import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(255)
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(255)
  password: string;
}

export class UpdateUserDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  email?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  password?: string;
}

export class UserResponseDto {
  id: number;
  name: string;
  email: string;
}
