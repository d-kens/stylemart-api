import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthReqDto } from './dtos/auth-request.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('register')
    register(@Body(ValidationPipe) userData: CreateUserDto) {
        return this.authService.register(userData);
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    login(@Body(ValidationPipe) authReqDto: AuthReqDto) {
        return authReqDto; 
    }
}
