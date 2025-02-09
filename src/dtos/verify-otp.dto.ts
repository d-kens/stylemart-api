import { IsNotEmpty, IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyOTPDto {
  @ApiProperty({ description: "User ID of the requester", example: "12345" })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: "6-digit OTP", example: "123456" })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{6}$/, { message: "OTP must be a string of 6 digits." })
  otp: string;
}