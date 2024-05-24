import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmController } from 'src/controllers/film.controller';
import { FilmModel } from 'src/models/film.model';

@Module({
  imports: [TypeOrmModule.forFeature([FilmModel])],
  controllers: [FilmController],
})
export class FilmModule {}
