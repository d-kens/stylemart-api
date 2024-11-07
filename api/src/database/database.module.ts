import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
                migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
                cli: {
                    migrationsDir: __dirname + '/migrations/',
                }
            }),
            inject: [ConfigService]
        })
    ]
})
export class DatabaseModule {}


