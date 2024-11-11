import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { RoleEnum } from "../../enums/role.enum";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsEnum(RoleEnum)
    @IsOptional()
    role?: RoleEnum;

    @IsString()
    @IsOptional()
    refreshToken?: string;
}