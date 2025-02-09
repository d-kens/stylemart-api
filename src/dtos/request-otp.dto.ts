
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RequestOTPDto {
  @ApiProperty({ description: "User ID requesting OTP", example: "12345" })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: "Email address of the user", example: "user@example.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}