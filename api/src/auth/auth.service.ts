import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService
    ) {}

    register(userData: CreateUserDto) {
        return this.usersService.create(userData)
    }
}
