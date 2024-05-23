import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from 'src/dtos/user.dto';
import { UserModel } from 'src/models/user.model';
import { verifyToken } from 'src/utils/bearer.util';
import { hashPassword } from 'src/utils/hash.util';
import { Repository } from 'typeorm';

@Controller('/user')
export class UserController {
  constructor(
    @InjectRepository(UserModel) private model: Repository<UserModel>,
  ) {}

  @Post()
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
  public async getOne(
    @Param('id') id: number,
    @Headers('authorization') authToken: string,
  ): Promise<{ data: UserResponseDto }> {
    try {
      await verifyToken(authToken);

      const user = await this.model.findOne({ where: { id } });

      if (!user) throw new NotFoundException('User not found');

      const { password, ...userWithoutPassword }: UserModel = user;

      return { data: userWithoutPassword };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  public async getAll(
    @Headers('authorization') authToken: string,
  ): Promise<{ data: UserResponseDto[] }> {
    try {
      await verifyToken(authToken);

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
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Headers('authorization') authToken: string,
  ): Promise<{ data: UserResponseDto }> {
    try {
      await verifyToken(authToken);

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
  public async delete(
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') authToken: string,
  ): Promise<{ data: string }> {
    try {
      await verifyToken(authToken);

      const userToDelete = await this.model.findOne({ where: { id } });

      if (!userToDelete) throw new NotFoundException('User not found');

      await this.model.delete(id);

      return { data: 'Deleted with success' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
