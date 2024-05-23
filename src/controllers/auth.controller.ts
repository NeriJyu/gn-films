import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/dtos/auth.dto';
import { UserModel } from 'src/models/user.model';
import { encode } from 'src/utils/bearer.util';
import { comparePassword } from 'src/utils/hash.util';
import { Repository } from 'typeorm';

@Controller('/auth')
export class AuthController {
  constructor(
    @InjectRepository(UserModel) private userModel: Repository<UserModel>,
  ) {}

  @Post()
  public async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ data: { token: string } }> {
    try {
      const findedUser = await this.userModel.findOne({
        where: { email: loginDto.email },
      });

      const passwordIsValid = await comparePassword(
        loginDto.password,
        findedUser.password,
      );

      let bearer = '';

      if (passwordIsValid) {
        bearer = encode({
          id: findedUser.id,
          name: findedUser.name,
          email: findedUser.email,
        });
      } else {
        throw new BadRequestException('Invalid credentials');
      }

      return { data: { token: bearer } };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
