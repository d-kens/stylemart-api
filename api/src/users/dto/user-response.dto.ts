import { User } from "src/entities/user.entity";

export class UserReponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;


    constructor(user: User) {
        this.id = user.id;
        this.firstName = user.fullName.split(" ")[0];
        this.lastName = user.fullName.split(" ")[1];
        this.email = user.email;
        this.refreshToken = user.refreshToken;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}