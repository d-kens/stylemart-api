import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger"; // Import the ApiProperty decorator
import { RoleEnum } from "src/enums/role.enum";

export class CreateUserDto {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John', 
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe', 
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com', 
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'strongPassword123', 
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890', 
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: RoleEnum, 
    required: false, 
  })
  @IsEnum(RoleEnum)
  @IsOptional()
  role?: RoleEnum;
}
