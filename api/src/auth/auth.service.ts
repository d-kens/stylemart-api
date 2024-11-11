import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import * as process from 'process';
import { TokenPayload } from './interfaces/token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    register(userData: CreateUserDto) {
        return this.usersService.create(userData)
    }

    async login(user: User, response: Response) {

        try {
            const accessTokenExpiryTime = new Date();
            accessTokenExpiryTime.setTime(accessTokenExpiryTime.getTime() + parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS));

            const refreshTokenExpiryTime = new Date();
            refreshTokenExpiryTime.setTime(refreshTokenExpiryTime.getTime() + parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS));

            const tokenPayload: TokenPayload = {
                userId: user.id
            }

            const accessToken = this.jwtService.sign(tokenPayload, {
                secret: process.env.JWT_ACCESS_TOKEN_SECRET,
                expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS}ms`
            });


            const refreshToken = this.jwtService.sign(tokenPayload,  {
                secret: process.env.JWT_REFRESH_TOKEN_SECRET,
                expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS}ms`
            });

            await this.usersService.update(user.id, {
                refreshToken:  await bcrypt.hash(refreshToken, 10)
            });

            response.cookie('AccessToken', accessToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                expires: accessTokenExpiryTime
            });

            response.cookie('RefreshToken', refreshToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                expires: refreshTokenExpiryTime
            });

            return { message: 'Login Successful'}
        } catch (error) {
            throw new InternalServerErrorException('User Login Failed', error);
        }
    }


    async validateUser(email: string, password: string) {
        const user = await this.usersService.findUserByEmail(email);

        if(!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if(!isPasswordValid) return null;

        return user;
    }


    async verifyUserRefreshToken(refreshToken: string, userId: string) {
        const user = await this.usersService.findById(userId);

        if(!user) return null;

        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);

        if(!isRefreshTokenValid) return null;

        return user;
    }
}
