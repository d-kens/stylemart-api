import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({ description: "The reset token sent to the user" })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ description: "The new password of the user" })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}