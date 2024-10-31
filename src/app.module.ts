import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { Files } from './files/entities/file.entity';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Files]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_BASE_URL,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }), FilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
