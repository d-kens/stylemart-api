import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/dtos/create-user.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Response } from "express";
import { CurrentUser } from "./decorators/current-user.decorator";
import { User } from "src/entities/user.entity";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh-auth.guard";
import { ForgotPasswordDto } from "src/dtos/forgot-pwd.dto";
import { ResetPasswordDto } from "src/dtos/reset-password.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { ChangePasswordDto } from "src/dtos/change-password.dto";
import { UserResponseDto } from "src/dtos/user-reponse.dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User registered successfully", type: UserResponseDto })
  @ApiBody({ type: CreateUserDto })
  @Post("register")
  async register(
    @Body(ValidationPipe) userData: CreateUserDto,
  ): Promise<UserResponseDto> {
    const result = await this.authService.register(userData);
    return new UserResponseDto(result);
  }

  @ApiOperation({ summary: "User login" })
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(user, response);
  }

  @ApiOperation({ summary: "Get current authenticated user" })
  @ApiResponse({ status: 200, description: "Returns current user data", type: UserResponseDto })
  @UseGuards(JwtAuthGuard)
  @Get("user")
  async getCurrentUser(@CurrentUser() user: User): Promise<UserResponseDto> {
    return new UserResponseDto(user);
  }

  @ApiOperation({ summary: "Refresh authentication token" })
  @UseGuards(JwtRefreshAuthGuard)
  @Post("refresh-token")
  async refreshToken(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
  }

  @ApiOperation({ summary: "Verify email address" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        token: { type: "string", example: "your-verification-token" },
      },
      required: ["token"],
    },
  })
  @Post("verify-email")
  async verifyEmail(@Body("token") token: string) {
    if (!token) {
      throw new BadRequestException("Verification token is required");
    }

    const decoded = await this.authService.verifyEmail(token);
    return {
      message: "Email verification successful.",
      data: decoded,
    };
  }

  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ForgotPasswordDto }) 
  @ApiResponse({ status: 200, description: 'Password reset link sent.' }) 
  @ApiResponse({ status: 404, description: 'User not found.' }) 
  @Post('forgot-password')
  async forgotPassword(@Body(ValidationPipe) forgotPwdData: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPwdData.email);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ type: ResetPasswordDto }) 
  @ApiResponse({ status: 200, description: 'Password reset successfully.' }) 
  @ApiResponse({ status: 400, description: 'Invalid token or password.' }) 
  @Post('reset-password')
  async resetPassword(@Body(ValidationPipe) resetPwdData: ResetPasswordDto) {
    return this.authService.resetPassword(resetPwdData);
  }

  @ApiOperation({ summary: 'Change password' })
  @UseGuards(JwtRefreshAuthGuard)
  @ApiBody({ type: ChangePasswordDto }) 
  @ApiResponse({ status: 200, description: 'Password changed successfully.' }) 
  @ApiResponse({ status: 401, description: 'Unauthorized.' }) 
  @Post('change-password')
  async changePassword(
    @Body(ValidationPipe) changePwdData: ChangePasswordDto,
    @CurrentUser() user: User,
  ) {
    return await this.authService.changePassword(changePwdData, user);
  }

  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully.' }) 
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('RefreshToken');
    return {
      message: 'Logged out successfully.',
    };
  }
}
