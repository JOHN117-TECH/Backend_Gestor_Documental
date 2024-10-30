import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, MinLength } from 'class-validator';

export class UpdateFileDto {
    @IsOptional()
    @MinLength(6)
    @IsString()
    filename?: string;

    @IsOptional()
    @MinLength(4)
    @IsString()
    path?: string;

    @IsOptional()
    @IsString()
    mimetype?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    size?: number;
}
