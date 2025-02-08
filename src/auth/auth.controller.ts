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
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/dtos/create-user.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Response } from "express";
import { CurrentUser } from "./decorators/current-user.decorator";
import { User } from "src/entities/user.entity";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh-auth.guard";
import { ForgotPasswordDto } from "src/dtos/forgot-pwd.dto";
import { ResetPasswordDto } from "src/dtos/reset-password.dto";
import { ChangepasswordDto } from "src/dtos/change-password.dto";
import { UserReponseDto } from "src/dtos/user-reponse.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth') // Tag for grouping endpoints in Swagger
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateUserDto }) // Documentation for request body
  @Post("register")
  async register(
    @Body(ValidationPipe) userData: CreateUserDto,
  ): Promise<UserReponseDto> {
    const result = await this.authService.register(userData);
    return new UserReponseDto(result);
  }

  @ApiBearerAuth() // Indicates that the endpoint requires a Bearer token
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(user, response);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Current user retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Get("user")
  async getCurrentUser(@CurrentUser() user: User): Promise<UserReponseDto> {
    return new UserReponseDto(user);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Token refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtRefreshAuthGuard)
  @Post("refresh-token")
  async refreshToken(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
  }

  @ApiResponse({ status: 200, description: 'Email verification successful.' })
  @ApiResponse({ status: 400, description: 'Verification token is required.' })
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

  @ApiResponse({ status: 200, description: 'Password reset email sent.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: ForgotPasswordDto })
  @Post("forgot-password")
  async forgotPassword(@Body(ValidationPipe) forgotPwdData: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPwdData.email);
  }

  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: ResetPasswordDto })
  @Post("reset-password")
  async resetPassword(@Body(ValidationPipe) resetPwdData: ResetPasswordDto) {
    return this.authService.resetPassword(resetPwdData);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseGuards(JwtRefreshAuthGuard)
  @Post("change-password")
  async changePassword(
    @Body(ValidationPipe) changePwdData: ChangepasswordDto,
    @CurrentUser() user: User,
  ) {
    return await this.authService.changePassword(changePwdData, user);
  }

  @ApiResponse({ status: 200, description: 'Logged out successfully.' })
  @Post("logout")
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("RefreshToken");

    return {
      message: "Logged out successfully.",
    };
  }
}
