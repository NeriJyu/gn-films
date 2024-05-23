import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateFilmDto {
  @IsString()
  @MaxLength(1000)
  @ApiProperty({
    example: 'A brief introduction to the film',
    description: 'Introduction of the film',
  })
  introduction: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    example: 'Planeta Dos Macacos: O Reinado',
    description: 'Name of the film',
  })
  name: string;

  @IsString()
  @MaxLength(255)
  @ApiProperty({
    example: 'Ação, Aventura',
    description: 'Genres of the film',
  })
  genre: string;

  @IsString()
  @MaxLength(255)
  @ApiProperty({ example: 'Wes Ball', description: 'Director of the film' })
  direction: string;

  @IsNumber()
  @ApiProperty({
    example: '145',
    description: 'Duration of the film in minutes',
  })
  time: number;

  @IsBoolean()
  @ApiProperty({ example: true, description: 'If the film is in 3d' })
  is3d: boolean;

  @IsBoolean()
  @ApiProperty({ example: true, description: 'If the film is dubbed' })
  dubbed: boolean;

  @IsBoolean()
  @ApiProperty({ example: true, description: 'If the film is subtitled' })
  subtitled: boolean;
}

export class UpdateFilmDto {
  @IsString()
  @MaxLength(1000)
  @ApiProperty({
    example: 'A brief introduction to the film',
    description: 'Introduction of the film',
  })
  introduction: string;

  @IsString()
  @MaxLength(255)
  @ApiProperty({
    example: 'Planeta Dos Macacos: O Reinado',
    description: 'Name of the film',
  })
  name: string;

  @IsString()
  @MaxLength(255)
  @ApiProperty({
    example: 'Ação, Aventura',
    description: 'Genres of the film',
  })
  genre: string;

  @IsString()
  @MaxLength(255)
  @ApiProperty({ example: 'Wes Ball', description: 'Director of the film' })
  direction: string;

  @IsNumber()
  @ApiProperty({
    example: '145',
    description: 'Duration of the film in minutes',
  })
  time: number;

  @IsBoolean()
  @ApiProperty({ example: true, description: 'If the film is in 3d' })
  is3d: boolean;

  @IsBoolean()
  @ApiProperty({ example: true, description: 'If the film is dubbed' })
  dubbed: boolean;

  @IsBoolean()
  @ApiProperty({ example: true, description: 'If the film is subtitled' })
  subtitled: boolean;
}

export class FilmResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  introduction: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  genre: string;

  @ApiProperty()
  direction: string;

  @ApiProperty()
  time: number;

  @ApiProperty()
  is3d: boolean;

  @ApiProperty()
  dubbed: boolean;

  @ApiProperty()
  subtitled: boolean;
}
