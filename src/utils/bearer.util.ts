import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthorizedUserDto } from 'src/dtos/auth.dto';

export const encode = (value: any) => {
  if (!process.env.JWT_ENCODE)
    throw new InternalServerErrorException('Missing environment variable');

  const hash = jwt.sign({ value }, process.env.JWT_ENCODE, {
    expiresIn: '6h',
  });

  return hash;
};

export const decode = (bearer: string) => {
  if (!process.env.JWT_ENCODE) {
    throw new InternalServerErrorException('Missing environment variable');
  }

  const decoded = jwt.verify(bearer, process.env.JWT_ENCODE);

  return decoded;
};

export const verifyToken = async (
  bearer: string,
): Promise<AuthorizedUserDto> => {
  try {
    if (!bearer)
      throw new UnauthorizedException('Authorization header missing');

    const splitToken = bearer.split(' ')[1];

    const tokenVerified: any = decode(splitToken);

    const userAuthorized: AuthorizedUserDto = tokenVerified.value;

    return userAuthorized;
  } catch (error) {
    if (
      error instanceof UnauthorizedException ||
      error instanceof InternalServerErrorException
    )
      throw error;

    throw new BadRequestException('Error decoding token');
  }
};
