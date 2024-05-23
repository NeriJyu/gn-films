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
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from 'src/dtos/user.dto';
import { UserModel } from 'src/models/user.model';
import { AuthGuard } from 'src/utils/auth.guard';
import { hashPassword } from 'src/utils/hash.util';
import { Repository } from 'typeorm';

@ApiTags('user')
@Controller('/user')
export class UserController {
  constructor(
    @InjectRepository(UserModel) private model: Repository<UserModel>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Save a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  public async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ data: UserResponseDto }> {
    try {
      const existingUser = await this.model.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) throw new BadRequestException('Email already in use');

      const hashedPassword = await hashPassword(createUserDto.password);

      const userCreated = await this.model.save({
        ...createUserDto,
        password: hashedPassword,
      });

      const { password, ...userWithoutPassword }: UserModel = userCreated;

      return { data: userWithoutPassword };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the user.',
  })
  @ApiBearerAuth('KEY_AUTH')
  public async getOne(
    @Param('id') id: number,
  ): Promise<{ data: UserResponseDto }> {
    try {
      const user = await this.model.findOne({ where: { id } });

      if (!user) throw new NotFoundException('User not found');

      const { password, ...userWithoutPassword }: UserModel = user;

      return { data: userWithoutPassword };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
  })
  @ApiBearerAuth('KEY_AUTH')
  public async getAll(): Promise<{ data: UserResponseDto[] }> {
    try {
      const users = await this.model.find();

      if (users.length === 0) throw new NotFoundException('Users not found');

      const usersWithoutPassword = users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return { data: usersWithoutPassword };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update an user' })
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiBearerAuth('KEY_AUTH')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ data: UserResponseDto }> {
    try {
      const userToUpdate = await this.model.findOne({ where: { id } });

      if (!userToUpdate) throw new NotFoundException('User not found');

      if (updateUserDto.password) {
        const hashedPassword = await hashPassword(updateUserDto.password);
        updateUserDto.password = hashedPassword;
      }

      await this.model.update({ id }, updateUserDto);

      const userUpdated = await this.model.findOne({ where: { id } });

      const { password, ...userWithoutPassword }: UserModel = userUpdated;

      return { data: userWithoutPassword };
    } catch (error) {
      if (error.code === '23505')
        throw new BadRequestException('Email already in use');

      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete an user' })
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiBearerAuth('KEY_AUTH')
  @UseGuards()
  public async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: string }> {
    try {
      const userToDelete = await this.model.findOne({ where: { id } });

      if (!userToDelete) throw new NotFoundException('User not found');

      await this.model.delete(id);

      return { data: 'Deleted with success' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
