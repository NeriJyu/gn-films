import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LogInDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    example: 'teste@gmail.com',
    description: 'The email of the user',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'coxinha123',
    description: 'The password of the user',
  })
  password: string;
}

export class AuthorizedUserDto {
  id: number;
  name: string;
  email: string;
}
