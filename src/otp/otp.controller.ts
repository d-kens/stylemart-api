import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  ValidationPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from "@nestjs/swagger";
import { OtpService } from "./otp.service";
import { VerifyOTPDto } from "src/dtos/verify-otp.dto";
import { RequestOTPDto } from "src/dtos/request-otp.dto";

@ApiTags("OTP")
@Controller()
export class OtpController {
  constructor(private otpService: OtpService) {}

  @ApiOperation({ summary: "Request an OTP" })
  @ApiResponse({ status: 201, description: "OTP sent successfully." })
  @ApiBody({ type: RequestOTPDto })
  @Post("requestOtp")
  async requestOTP(
    @Body(ValidationPipe) requestOtpDto: RequestOTPDto,
  ): Promise<void> {
    const { userId, email } = requestOtpDto;
    return await this.otpService.requestOTP(userId, email);
  }

  @ApiOperation({ summary: "Verify an OTP" })
  @ApiResponse({ status: 200, description: "OTP verified successfully." })
  @ApiBody({ type: VerifyOTPDto })
  @Post("verifyOtp")
  async verifyOTP(@Body(ValidationPipe) verifyOTPDto: VerifyOTPDto) {
    const { userId, otp } = verifyOTPDto;
    return await this.otpService.verifyOTP(userId, otp);
  }

  @ApiOperation({ summary: "Revoke an OTP" })
  @ApiResponse({ status: 200, description: "OTP revoked successfully." })
  @ApiParam({ name: "userId", description: "User ID to revoke OTP for", example: "12345" })
  @Delete("revokeOtp/:userId")
  async revokeOTP(@Param("userId") userId: string) {
    return await this.otpService.revokeOTP(userId);
  }
}