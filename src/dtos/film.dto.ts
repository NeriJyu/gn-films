import { IsBoolean, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateFilmDto {
  @IsString()
  @MaxLength(1000)
  introduction: string;

  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(255)
  genre: string;

  @IsString()
  @MaxLength(255)
  direction: string;

  @IsNumber()
  time: number;

  @IsBoolean()
  is3d: boolean;

  @IsBoolean()
  dubbed: boolean;

  @IsBoolean()
  subtitled: boolean;
}
