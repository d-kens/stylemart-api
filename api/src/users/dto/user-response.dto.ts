import { User } from "src/entities/user.entity";


export class UserReponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
    createdAt: Date;
    updatedAt: Date;


    constructor(user: User) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.roles = user.roles.map(role => role.name);
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}