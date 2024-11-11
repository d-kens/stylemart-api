import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserReponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(
        @CurrentUser() user: User,
    ): Promise<UserReponseDto[]> {
        console.log(user)
        return this.usersService.findAll();
    }
}
