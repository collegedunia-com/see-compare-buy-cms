// src/user/dto/find-all.dto.ts

import { IsString, Length, } from 'class-validator';

export class ChangeUserPasswordDto {

    @IsString()
    @Length(6, 255)
    new_password: string;

}
