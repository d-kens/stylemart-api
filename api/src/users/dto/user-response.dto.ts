import { User } from "src/entities/user.entity";
import { RoleEnum } from "src/enums/role.enum";

export class UserReponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: RoleEnum;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;


    constructor(user: User) {
        this.id = user.id;
        this.firstName = user.fullName.split(" ")[0];
        this.lastName = user.fullName.split(" ")[1];
        this.email = user.email;
        this.role = user.role
        this.refreshToken = user.refreshToken;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}