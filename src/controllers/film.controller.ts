import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFilmDto } from 'src/dtos/film.dto';
import { FilmModel } from 'src/models/film.model';
import { Repository } from 'typeorm';

@Controller('/film')
export class FilmController {
  constructor(
    @InjectRepository(FilmModel) private model: Repository<FilmModel>,
  ) {}

  @Post()
  public async create(
    @Body() createFilmDto: CreateFilmDto,
  ): Promise<{ data: FilmModel }> {
    try {
      const filmCreated = await this.model.save(createFilmDto);

      return { data: filmCreated };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  public async GetOne(@Param('id') id: number): Promise<{ data: FilmModel }> {
    try {
      const film = await this.model.findOne({ where: { id } });

      if (!film) {
        throw new NotFoundException('Film not found');
      }

      return { data: film };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  public async getAll(): Promise<{ data: FilmModel[] }> {
    try {
      const films = await this.model.find();

      if (films.length === 0) throw new NotFoundException('Films not found');

      return { data: films };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() film: FilmModel,
  ): Promise<{ data: FilmModel }> {
    try {
      const filmToUpdate = await this.model.findOne({ where: { id } });

      if (!filmToUpdate) throw new NotFoundException('Film not found');

      await this.model.update({ id }, film);

      const filmUpdated = await this.model.findOne({ where: { id } });

      return { data: filmUpdated };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  public async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: string }> {
    try {
      const filmToDelete = await this.model.findOne({ where: { id } });

      if (!filmToDelete) throw new NotFoundException('Film not found');

      await this.model.delete(id);

      return { data: 'Deleted with success' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
