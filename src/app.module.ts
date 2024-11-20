import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from './files/files.module';
import { Files } from './files/entities/file.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Files]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    /* ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }), */
    FilesModule],
})
export class AppModule { }
