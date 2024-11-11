import { Request } from "express";
import * as process from 'process';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "../interfaces/token-payload.interface";
import { AuthService } from "../auth.service";


@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {

    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request.cookies?.RefreshToken,
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: TokenPayload): Promise<any> {
        return await this.authService.verifyUserRefreshToken(request.cookies?.RefreshToken, payload.userId)
    }
}