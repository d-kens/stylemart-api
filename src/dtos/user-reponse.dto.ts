import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/entities/user.entity";
import { RoleEnum } from "src/enums/role.enum";

export class UserResponseDto {
  @ApiProperty({ description: "The unique identifier of the user" })
  id: string;

  @ApiProperty({ description: "The first name of the user" })
  firstName: string;

  @ApiProperty({ description: "The last name of the user" })
  lastName: string;

  @ApiProperty({ description: "The phone number of the user" })
  phoneNumber: string;

  @ApiProperty({ description: "The email address of the user" })
  email: string;

  @ApiProperty({ description: "The role of the user", enum: RoleEnum })
  role: RoleEnum;

  @ApiProperty({ description: "The date when the user was created" })
  createdAt: Date;

  @ApiProperty({ description: "The date when the user was last updated" })
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.phoneNumber = user.phoneNumber;
    this.email = user.email;
    this.role = user.role;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
