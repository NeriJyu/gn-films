import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { UserModel } from 'src/models/user.model';
import { comparePassword } from 'src/utils/hash.util';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserModel) private userModel: Repository<UserModel>,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ data: { access_token: string } }> {
    try {
      const user = await this.userModel.findOne({
        where: { email },
      });

      if (!user) throw new NotFoundError('User not found');

      const passwordIsValid = await comparePassword(pass, user.password);

      if (!passwordIsValid)
        throw new UnauthorizedException('Invalid credentials');

      const payload = { id: user.id, username: user.email, name: user.name };

      return {
        data: {
          access_token: await this.jwtService.signAsync(payload),
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
