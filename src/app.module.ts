import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user.module';
import { FilmModule } from './modules/film.module';
// dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
    envFilePath: [".env.development.local", "env.development"],
  }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    database: "ApiFilm",
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    entities: ["dist/**/*.model.js"],
    synchronize: true,
  }),
  UserModule,
  FilmModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
// @Module({
//   imports: [TypeOrmModule.forRoot({
//     type: 'postgres',
//     host: process.env.DB_HOST,
//     port: 5432,
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: 'postgres',
//     entities: [],
//     synchronize: true,
//     autoLoadEntities: true,
//   }),],
//   controllers: [AppController],
//   providers: [AppService],
// })
export class AppModule {}
