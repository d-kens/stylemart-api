import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.getOrThrow('DATASOURCE_HOST'),
                port: configService.getOrThrow('DATASOURCE_PORT'),
                username: configService.getOrThrow('DATASOURCE_USERNAME'),
                password: configService.getOrThrow('DATASOURCE_PASSWORD'),
                database: configService.getOrThrow('DATASOURCE_DATABASE'),
                synchronize: configService.getOrThrow('MYSQL_SYNCHRONIZE'),
                autoLoadEntities: true,
                entities: [User, Category, Product],
                migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
            }),
            inject: [ConfigService]
        })
    ]
})
export class DatabaseModule {}


