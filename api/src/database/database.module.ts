import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: process.env.DATASOURCE_HOST,
                port: parseInt(process.env.DATASOURCE_PORT, 10) || 3307,
                username: process.env.DATASOURCE_USERNAME,
                password: process.env.DATASOURCE_PASSWORD,
                database: process.env.DATASOURCE_DATABASE,
                entities: [],
                synchronize: true,
                autoLoadEntities: true,
            }),
            inject: [ConfigService]
        })
    ]
})
export class DatabaseModule {}


