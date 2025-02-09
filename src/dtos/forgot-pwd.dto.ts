import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({ description: "The email of the user requesting password reset" })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}