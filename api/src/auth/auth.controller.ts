import { Body, Controller, Post, UseGuards, ValidationPipe, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { Response } from 'express';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

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
    login(
        @CurrentUser() user: User,
        @Res({ passthrough: true }) response: Response
    ) {
        return this.authService.login(user, response)
    }

    @Post('refreshToken')
    @UseGuards(JwtRefreshAuthGuard)
    async refreshToken(
        @CurrentUser() user: User, 
        @Res({ passthrough: true }) response: Response
    ) {
        await this.authService.login(user, response);
    }
}
