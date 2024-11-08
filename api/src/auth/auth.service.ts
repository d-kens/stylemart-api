import { Injectable } from '@nestjs/common';
import { CreateUSerDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService
    ) {}


    async register(userData: CreateUSerDto) {
        this.usersService.create(userData)
    }
}
