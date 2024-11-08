import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class CreateUSerDto {
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

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}