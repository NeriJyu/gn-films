import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controllers/user.controller';
import { UserModel } from 'src/models/user.model';
import { RedisService } from 'src/services/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [RedisService],
  exports: [RedisService],
})
export class UserModule {}
