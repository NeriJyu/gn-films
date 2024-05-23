import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user.module';
import { FilmModule } from './modules/film.module';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', 'env.development'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'ApiFilm',
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      entities: ['dist/**/*.model.js'],
      synchronize: true,
    }),
    UserModule,
    FilmModule,
    AuthModule,
  ],
})
export class AppModule {}
