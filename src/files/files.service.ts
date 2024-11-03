import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { promises as fs } from 'fs';

import { Files } from './entities/file.entity';
import { UpdateFileDto } from './dtos/update-file.dto';

@Injectable()
export class FilesService {
    private readonly uploadPath = './uploads';

    constructor(
        @InjectRepository(Files)
        private fileRepository: Repository<Files>,
    ) {

        this.fileRepository.find().then(files => console.log('Files in database:', files));
        // Prueba guardar un archivo de ejemplo al iniciar el servicio

    }


    async getFileMetadata(filename: string): Promise<Files> {
        console.log(`Fetching file metadata for filename: ${filename}`);

        // Temporalmente imprime todos los registros en la tabla para revisar
        const allFiles = await this.fileRepository.find();
        console.log('All files in database:', allFiles);

        const file = await this.fileRepository.findOne({ where: { filename } });
        if (!file) {
            console.log(`File metadata not found in the database for filename: ${filename}`);
            throw new Error('File not found');
        }
        console.log(`File metadata retrieved:`, file);
        return file;
    }
    getFilePath(filename: string): string {
        return join(process.cwd(), 'uploads', filename); // Asegúrate de que esta ruta sea correcta
    }

    async saveFileMetadata(file: Express.Multer.File): Promise<Files> {
        // Crear una instancia de la entidad File
        const fileEntity = this.fileRepository.create({
            filename: file.filename,
            path: `uploads/${file.filename}`, // Ajusta la ruta según la configuración
            mimetype: file.mimetype,
            size: file.size,
            createdAt: new Date(),
        });

        console.log('Saving file entity to database:', fileEntity);

        // Guardar en la base de datos
        return await this.fileRepository.save(fileEntity);
    }
    getFilePathComplete(filename: string): string {
        return join(process.cwd(), this.uploadPath, filename); // Debe ser la ruta completa
    }

    /*   async getFilePath(filename: string): Promise<string> {
          const file = await this.fileRepository.findOneBy({ filename });
          if (!file) throw new Error('File not found');
          return file.path;
      }
   */

    async updateFile(id: string, updateData: UpdateFileDto): Promise<Files> {
        const file = await this.fileRepository.findOne({ where: { id } });

        if (!file) {
            throw new NotFoundException('File not found');
        }

        // Actualizamos los datos
        Object.assign(file, updateData);

        // Guardamos los cambios
        return await this.fileRepository.save(file);
    }

    async deleteFile(filename: string): Promise<void> {
        // Encuentra el archivo en la base de datos
        const file = await this.fileRepository.findOne({ where: { filename } });
        if (!file) throw new Error('File not found');

        // Elimina el registro de la base de datos
        await this.fileRepository.delete({ filename });

        // Elimina el archivo físico de la carpeta 'uploads'
        try {
            await fs.unlink(file.path); // Borra el archivo usando su ruta completa
            console.log(`File ${file.path} deleted successfully from uploads folder.`);
        } catch (error) {
            console.error(`Error deleting file ${file.path} from uploads folder:`, error);
            throw new Error('Failed to delete the physical file');
        }
    }

    async deleteAllFiles(): Promise<string> {
        try {
            const files = await this.fileRepository.find();
            // Recorre y elimina cada archivo de la carpeta 'uploads'
            for (const file of files) {
                try {
                    await fs.unlink(`./uploads/${file.path}`);
                    console.log(`File ${file.path} deleted successfully from uploads folder.`);
                } catch (error) {
                    console.error(`Error deleting file ${file.path} from uploads folder:`, error);
                }
            }
            // Elimina todos los registros de la base de datos
            await this.fileRepository.clear();
            console.log('All files have been deleted from the database.');

            return 'All files have been deleted from the database and uploads folder.';
        } catch (error) {
            console.error('Error deleting all files:', error);
            throw new Error('Failed to delete all files');
        }
    }

    async getAllFiles(): Promise<Files[]> {
        return await this.fileRepository.find();
    }
}
