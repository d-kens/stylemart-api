import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserReponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ){}


    async findAll(): Promise<UserReponseDto[]> {
        const users =  await this.usersRepository.find();

        return users.map(user => new UserReponseDto(user));
    }

    async findById(id: string): Promise<UserReponseDto> {
        const user = await this.usersRepository.findOne({
            where: { id }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return new UserReponseDto(user);
    }


    async findUserByEmail(email: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { email }
        });

        return user;
    }


    async create(createUserDto: CreateUserDto): Promise<UserReponseDto> {
        const user = await this.findUserByEmail(createUserDto.email);

        if(user) throw new ConflictException('User already exists');

        try {
            const user = new User({
                ...createUserDto,
                fullName: `${createUserDto.firstName} ${createUserDto.lastName}`,
                passwordHash: await hash(createUserDto.password, 10)
            });

            const savedUser =  await this.usersRepository.save(user);

            return new UserReponseDto(savedUser);

        } catch (error) {
            throw new InternalServerErrorException('Failed to created user');
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserReponseDto> {
        const existingUser = await this.findById(id);

        try {
            const updatedUser = Object.assign(existingUser, updateUserDto);
            return await this.usersRepository.save(updatedUser);

        } catch (error) {
            throw new InternalServerErrorException('Failed to update user');
        }
    }


    async deleteUser(id: string) {
        const result = await this.usersRepository.delete({ id });

        if (result.affected === 0) {
            throw new NotFoundException(`User with ID: ${id} not found`);
        }
    }



}
