import { Controller, Delete, Get, Param, Put, UseGuards, Body } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { UserReponseDto } from "src/dtos/user-reponse.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { RoleEnum } from "src/enums/role.enum";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UpdateUserDto } from "src/dtos/update-user.dto";

@ApiTags("users") 
@ApiBearerAuth() 
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: "Retrieve all users" }) 
  @ApiResponse({ status: 200, description: "List of users", type: [UserReponseDto] })
  @ApiResponse({ status: 401, description: "Unauthorized" }) 
  @ApiResponse({ status: 403, description: "Forbidden" }) 
  async findAll(): Promise<UserReponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserReponseDto(user));
  }

  @UseGuards(JwtAuthGuard)
  @Get(":userId")
  @ApiOperation({ summary: "Retrieve a user by ID" }) 
  @ApiParam({ name: "userId", required: true, description: "ID of the user to retrieve" })
  @ApiResponse({ status: 200, description: "User details", type: UserReponseDto })
  @ApiResponse({ status: 404, description: "User not found" }) 
  @ApiResponse({ status: 401, description: "Unauthorized" }) 
  async findOne(@Param("userId") userId: string): Promise<UserReponseDto> {
    const result = await this.usersService.findOneById(userId);
    return new UserReponseDto(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":userId")
  @ApiOperation({ summary: "Update a user by ID" }) 
  @ApiParam({ name: "userId", required: true, description: "ID of the user to update" }) 
  @ApiResponse({ status: 200, description: "Updated user details", type: UserReponseDto })
  @ApiResponse({ status: 404, description: "User not found" }) 
  @ApiResponse({ status: 401, description: "Unauthorized" }) 
  async update(
    @Body() userData: UpdateUserDto,
    @Param("userId") userId: string,
  ): Promise<UserReponseDto> {
    const result = await this.usersService.update(userId, userData);
    return new UserReponseDto(result);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":userId")
  @ApiOperation({ summary: "Delete a user by ID" }) 
  @ApiParam({ name: "userId", required: true, description: "ID of the user to delete" })
  @ApiResponse({ status: 204, description: "User deleted successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" }) 
  async delete(@Param("userId") userId: string) {
    return await this.usersService.delete(userId);
  }
}
