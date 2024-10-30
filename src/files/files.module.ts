import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Files } from './entities/file.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Files]),
        MulterModule.register({
            storage: diskStorage({
                destination: './uploads', // Asegúrate de que esta carpeta existe
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    callback(null, uniqueSuffix + '-' + file.originalname);
                },
            }),
        }),
    ],
    controllers: [FilesController],
    providers: [FilesService],
})
export class FilesModule { }

