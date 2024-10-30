import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Get,
    Res,
    Param,
    Delete,
    HttpException,
    HttpStatus,
    Patch,
    Body,
    NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { promises as fs } from 'fs';
import { FilesService } from './files.service';
import { Response } from 'express';
import { Files } from './entities/file.entity';
import { UpdateFileDto } from './dtos/update-file.dto';


@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Get()
    async getAllFiles(): Promise<Files[]> {
        return await this.filesService.getAllFiles();
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new Error('File not provided');
        }

        // Guarda la metadata del archivo en la base de datos
        const savedFile = await this.filesService.saveFileMetadata(file);

        return { filename: savedFile.filename };
    }

    @Patch(':id')
    async updateFile(
        @Param('id') id: string,
        @Body() updateData: UpdateFileDto, 
    ): Promise<Files> {
        try {
            const updatedFile = await this.filesService.updateFile(id, updateData);
            return updatedFile;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('File not found');
            }
            throw error;
        }
    }

    @Get(':filename')
    async getFile(@Param('filename') filename: string, @Res() res: Response) {

        try {
            // Obtiene la metadata del archivo desde la base de datos
            const file = await this.filesService.getFileMetadata(filename);

            // Construye la ruta completa del archivo en el sistema de archivos
            const filePath = this.filesService.getFilePath(file.filename);

            // Verifica que el archivo exista en el sistema de archivos
            await fs.access(filePath);
            res.sendFile(filePath);
        } catch (error) {
            console.error(`Error while accessing file:`, error.message);
            throw new HttpException('File not found in filesystem', HttpStatus.NOT_FOUND);
        }
    }



    @Delete(':filename')
    async deleteFile(@Param('filename') filename: string) {
        await this.filesService.deleteFile(filename);
        return { message: 'File deleted successfully' };
    }
}
