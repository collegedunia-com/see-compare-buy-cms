import { IsString, IsEmail, Length, IsIn, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/user/models/user.model';
import { Transform } from 'class-transformer';
export class CreateAuthDto {

    @ApiProperty()
    @IsString()
    @Length(1, 255)
    readonly name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Length(1, 4096)
    readonly bio?: string;

    @ApiProperty()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @IsString()
    @Length(6, 255)
    readonly password: string;

    @ApiProperty({ enum: UserRole })
    @IsIn([UserRole.Admin, UserRole.User])
    readonly role: UserRole;

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

    @ApiProperty({ required: false })
    @IsOptional()
    readonly twitter_url?: string;
    
    @ApiProperty({ required: false })
    @IsOptional()
    readonly custom_website_url?: string;

    readonly last_login_at: Date;

    @ApiProperty({ required: true })
    readonly slug: string;

}
