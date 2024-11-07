import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.entity";
dotenv.config();


export default new DataSource({
    type: 'mysql',
    host: process.env.DATASOURCE_HOST,
    port: parseInt(process.env.DATASOURCE_PORT, 10),
    username: process.env.DATASOURCE_USERNAME,
    password: process.env.DATASOURCE_PASSWORD,
    database: process.env.DATASOURCE_DATABASE,
    migrations: ['src/migrations/**/*.ts'],
    entities: [User, Role]
});
