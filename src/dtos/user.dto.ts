import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({ example: "Gustavo Neri", description: 'User name' })
  name: string;

  @IsString()
  @MaxLength(255)
  @IsEmail()
  @ApiProperty({ example: "teste@gmail.com", description: 'User email' })
  email: string;

  @IsString()
  @MaxLength(255)
  @ApiProperty({ example: "coxinha123", description: 'User password' })
  password: string;
}

export class UpdateUserDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  @ApiProperty({ example: "Gustavo Neri", description: 'User name' })
  name?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  @ApiProperty({ example: "teste@gmail.com", description: 'User email' })
  email?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  @ApiProperty({ example: "coxinha123", description: 'User password' })
  password?: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
