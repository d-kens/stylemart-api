import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { RoleEnum } from "src/enums/role.enum";


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(RoleEnum)
    @IsOptional()
    role?: RoleEnum;
}