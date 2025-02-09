import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger"; 
import { RoleEnum } from "src/enums/role.enum";

export class UpdateUserDto {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
    required: false, 
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    required: false, 
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
    required: false, 
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
    required: false, 
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: RoleEnum, 
    required: false, 
  })
  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;

  @ApiProperty({
    description: 'Indicates if the user\'s email is verified',
    example: true,
    required: false, 
  })
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'newStrongPassword123',
    required: false, 
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'The refresh token of the user',
    example: 'someRefreshToken',
    required: false, 
  })
  @IsString()
  @IsOptional()
  refreshToken?: string;
}
