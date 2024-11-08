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
        this.firstName = user.fullName.split(" ")[0];
        this.lastName = user.fullName.split(" ")[1];
        this.email = user.email;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}