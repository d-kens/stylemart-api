import { Request } from "express";
import * as process from 'process';
import { Injectable } from "@nestjs/common";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { PassportStrategy } from "@nestjs/passport";
import { UsersService } from "src/users/users.service";
import { TokenPayload } from "../interfaces/token-payload.interface";
import { User } from "src/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request.cookies?.AccessToken,
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET
        })
    }
    
    async validate(payload: TokenPayload): Promise<User> {
        return this.usersService.findById(payload.userId)
    }

}