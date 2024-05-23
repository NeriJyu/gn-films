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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateFilmDto,
  FilmResponseDto,
  UpdateFilmDto,
} from 'src/dtos/film.dto';
import { FilmModel } from 'src/models/film.model';
import { AuthGuard } from 'src/utils/auth.guard';
import { Repository } from 'typeorm';

@ApiTags('film')
@Controller('/film')
export class FilmController {
  constructor(
    @InjectRepository(FilmModel) private model: Repository<FilmModel>,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Save a new film' })
  @ApiBody({ type: CreateFilmDto })
  @ApiResponse({
    status: 201,
    description: 'The film has been successfully created.',
  })
  @ApiBearerAuth('KEY_AUTH')
  public async create(
    @Body() createFilmDto: CreateFilmDto,
  ): Promise<{ data: FilmResponseDto }> {
    try {
      const filmCreated = await this.model.save(createFilmDto);

      return { data: filmCreated };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get film by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Film ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the film.',
  })
  @ApiBearerAuth('KEY_AUTH')
  public async GetOne(
    @Param('id') id: number,
  ): Promise<{ data: FilmResponseDto }> {
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
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all films' })
  @ApiResponse({
    status: 200,
    description: 'Return all films.',
  })
  @ApiBearerAuth('KEY_AUTH')
  public async getAll(): Promise<{ data: FilmResponseDto[] }> {
    try {
      const films = await this.model.find();

      if (films.length === 0) throw new NotFoundException('Films not found');

      return { data: films };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a film' })
  @ApiParam({ name: 'id', description: 'Film ID', type: Number })
  @ApiBody({ type: UpdateFilmDto })
  @ApiResponse({
    status: 200,
    description: 'The film has been successfully updated.',
  })
  @ApiBearerAuth('KEY_AUTH')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() film: UpdateFilmDto,
  ): Promise<{ data: FilmResponseDto }> {
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
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a film' })
  @ApiParam({ name: 'id', description: 'Film ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The film has been successfully deleted.',
  })
  @ApiBearerAuth('KEY_AUTH')
  @UseGuards()
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
