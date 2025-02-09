import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({ description: "The old password of the user" })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({ description: "The new password of the user" })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}