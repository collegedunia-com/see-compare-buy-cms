// src/user/dto/find-all.dto.ts

import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsEmail, IsIn, IsString, Min, Max } from 'class-validator';

export class FindAllDto {

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    @Min(0)
    @Max(10000)
    offset: number = 0;

    @IsOptional()
    @IsString()
    name: string = '';

    @IsOptional()
    @IsString()
    email: string = '';

    @IsOptional()
    @IsIn(['user', 'admin'])
    role?: string;

    @IsOptional()
    @IsString()
    username: string = '';

}
