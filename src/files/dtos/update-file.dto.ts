import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, MinLength } from 'class-validator';

export class UpdateFileDto {

    @ApiProperty({
        example: "Hoja-de-vida.pdf",
        description: 'File FileName',
    })
    @IsOptional()
    @MinLength(6)
    @IsString()
    filename?: string;

    @ApiProperty({
        example: "uploads/Hoja-de-vida.pdf",
        description: 'File Path',
    })
    @IsOptional()
    @MinLength(4)
    @IsString()
    path?: string;

    @ApiProperty({
        example: "application/pdf",
        description: 'File Mimetype',
    })
    @IsOptional()
    @IsString()
    mimetype?: string;

    @ApiProperty({
        example: "790058",
        description: 'File Size',
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    size?: number;
}
