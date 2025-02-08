import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  ValidationPipe,
} from "@nestjs/common";
import { OtpService } from "./otp.service";
import { VerifyOTPDto } from "src/dtos/verify-otp.dto";
import { RequestOTPDto } from "src/dtos/request-otp.dto";
import { ApiTags, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('OTP') 
@Controller()
export class OtpController {
  constructor(private otpService: OtpService) {}

  @ApiBody({ type: RequestOTPDto })
  @ApiResponse({ status: 200, description: 'OTP request successful.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post("requestOtp")
  async requestOTP(
    @Body(ValidationPipe) requestOtpDto: RequestOTPDto,
  ): Promise<void> {
    const { userId, email } = requestOtpDto;
    return await this.otpService.requestOTP(userId, email);
  }

  @ApiBody({ type: VerifyOTPDto })
  @ApiResponse({ status: 200, description: 'OTP verification successful.' })
  @ApiResponse({ status: 400, description: 'Invalid OTP or user ID.' })
  @Post("verifyOtp")
  async verifyOTP(@Body(ValidationPipe) verifyOTPDto: VerifyOTPDto) {
    const { userId, otp } = verifyOTPDto;
    return await this.otpService.verifyOTP(userId, otp);
  }

  @ApiParam({ name: 'userId', required: true, description: 'Unique identifier of the user.' })
  @ApiResponse({ status: 200, description: 'OTP revoked successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Delete("revokeOtp/:userId")
  async revokeOTP(@Param("userId") userId: string) {
    return await this.otpService.revokeOTP(userId);
  }
}
