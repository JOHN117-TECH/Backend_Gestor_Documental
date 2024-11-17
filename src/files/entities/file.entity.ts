import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'files' })
export class Files {

    @ApiProperty({
        example: "ff0d5c1f-3de0-4834-987c-416f783490fa",
        description: 'File ID',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: "Hoja-de-vida.pdf",
        description: 'File ID',
    })
    @Column('text', {
        unique: true
    })
    filename: string;

    @ApiProperty({
        example: "uploads/Hoja-de-vida.pdf",
        description: 'File Path',
    })
    @Column('text', {
        unique: true
    })
    path: string;

    @ApiProperty({
        example: "application/pdf",
        description: 'File Mimetype',
    })
    @Column()
    mimetype: string;

    @ApiProperty({
        example: "790058",
        description: 'File Size',
    })
    @Column()
    size: number;

    @ApiProperty({
        example: "2024-11-17T19:39:26.009Z",
        description: 'File CreateAt',
    })
    @CreateDateColumn()
    createdAt: Date;
}
