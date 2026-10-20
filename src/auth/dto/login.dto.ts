import { IsString, Length } from 'class-validator';


export class LoginDto {
    @IsString()
    @Length(4, 255)
    readonly username: string;

    @IsString()
    @Length(6, 255)
    readonly password: string;

}
