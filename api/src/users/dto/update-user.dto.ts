import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { RoleEnum } from "../../enums/role.enum";
import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @IsOptional()
    refreshToken?: string;
}