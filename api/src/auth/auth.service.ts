import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService
    ) {}

    register(userData: CreateUserDto) {
        return this.usersService.create(userData)
    }


    async validateUser(email: string, password: string) {
        const user = await this.usersService.findUserByEmail(email);

        if(!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if(!isPasswordValid) return null;

        return user;
    }
}
