// file.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { Files } from '../files/entities/file.entity';
import { Response } from 'express';

import { FilesController } from '../files/files.controller';
import { FilesService } from '../files/files.service';
import { UpdateFileDto } from 'src/files/dtos/update-file.dto';

import { getRepositoryToken } from '@nestjs/typeorm';

describe('FileController', () => {
    let fileController: FilesController;
    let fileService: FilesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FilesController],
            providers: [
                {
                    provide: FilesService,
                    useValue: {
                        updateFile: jest.fn(),
                        getFileMetadata: jest.fn(),
                        deleteFile: jest.fn(),
                        getFilePath: jest.fn(),
                    },
                },
            ],
        }).compile();

        fileController = module.get<FilesController>(FilesController);
        fileService = module.get<FilesService>(FilesService);
    });

    it('should be defined', () => {
        expect(fileController).toBeDefined();
    });

    describe('uploadFile', () => {
        it('should call fileService.updateFile with id and updateData and return the updated file', async () => {
            const id = '1';
            const updateData: UpdateFileDto = {
                filename: 'test.txt', // Otras propiedades opcionales si lo necesitas
            };
            const result: Files = {
                id: '1',
                filename: 'test2.txt',
                path: 'uploads/test.txt',
                mimetype: 'text/plain',
                size: 100,
                createdAt: new Date(),
            };

            jest.spyOn(fileService, 'updateFile').mockResolvedValueOnce(result);

            // Llama al método y verifica el resultado
            expect(await fileController.updateFile(id, updateData)).toEqual(result);
            expect(fileService.updateFile).toHaveBeenCalledWith(id, updateData);
        });




    });

    describe('FileService', () => {
        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    FilesService,
                    {
                        provide: getRepositoryToken(Files),
                        useValue: {
                            find: jest.fn().mockResolvedValue([]), // Asegúrate de incluir find en el mock
                            findOne: jest.fn(),
                            save: jest.fn(),
                        },
                    },
                ],
            }).compile();

            fileService = module.get<FilesService>(FilesService);
        });

        it('should be defined', () => {
            expect(fileService).toBeDefined();
        });

        describe('uploadFile', () => {
            it('should return the uploaded file information', async () => {
                const mockFile: Files = {
                    id: '1',
                    filename: 'test.txt',
                    path: 'uploads/test.txt',
                    mimetype: 'text/plain',
                    size: 100,
                    createdAt: new Date(),
                };

                const result = { ...mockFile }; // Use the complete object
                const resultUpdate = { filename: 'nest.text', ...mockFile };
                const res = {
                    sendFile: jest.fn(),
                    status: jest.fn().mockReturnThis(),
                } as unknown as Response;

                jest.spyOn(fileService, 'updateFile').mockImplementation(() => Promise.resolve(result));

                // Pass both arguments if `updateFile` requires them
                expect(await fileService.updateFile("test.txt", resultUpdate)).toEqual(resultUpdate);
            });

        });

        describe('getFile', () => {
            it('should return the file if found', async () => {
                const result: Files = {
                    id: '1',
                    filename: 'test.txt',
                    path: 'uploads/test.txt',
                    mimetype: 'text/plain',
                    size: 100,
                    createdAt: new Date(),
                };
                const res = {
                    sendFile: jest.fn(),
                    status: jest.fn().mockReturnThis(),
                } as unknown as Response;
                jest.spyOn(fileService, 'getFileMetadata').mockImplementation(() => Promise.resolve(result));

                expect(await fileService.getFileMetadata('test.txt')).toEqual(result);
            });

            /* it('should throw an error if the file is not found', async () => {
                jest.spyOn(fileService, 'getFileMetadata').mockImplementation(() => {
                    throw new Error('File not found');
                });

                await expect(fileService.getFileMetadata('test.txt')).rejects.toThrow('File not found');
            }); */
        });

        describe('deleteFile', () => {
            it('should delete the file successfully', async () => {
                jest.spyOn(fileService, 'deleteFile').mockImplementation(() => Promise.resolve());

                await fileService.deleteFile('test.txt');
                expect(fileService.deleteFile).toHaveBeenCalledWith('test.txt');
            });
        });
    })
});
