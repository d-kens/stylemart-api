import { IsNotEmpty, IsString } from "class-validator";

export class AuthReqDto {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}