import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString,IsIn, Length, IsEmail, IsOptional, IsInt } from 'class-validator';
import { UserRole } from '../models/user.model';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @ApiProperty()
    @IsString()
    @Length(1, 255)
    readonly name: string;

    @ApiProperty()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Length(1, 4096)
    readonly bio?: string;

    @ApiProperty()
    @IsString()
    @Length(4, 255)
    readonly username: string;

    @ApiProperty({ required: false })
    @IsOptional()
    readonly avatar?: string;

    @ApiProperty()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    readonly is_author_active: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    readonly facebook_url?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    readonly instagram_url?: string;

    @ApiProperty({ enum: UserRole })
    @IsIn([UserRole.Admin, UserRole.User])
    readonly role: UserRole;

    @ApiProperty({ required: false })
    @IsOptional()
    readonly twitter_url?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    readonly custom_website_url?: string;

    @ApiProperty({ required: true })
    readonly slug: string;

}
