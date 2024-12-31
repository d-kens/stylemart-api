import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';
import { TokenModule } from './token/token.module';
import { MailerModule } from './mailer/mailer.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { FirebaseModule } from 'nestjs-firebase';
import * as process from 'process';
import { PaymentGatewayModule } from './payment-gateway/payment-gateway.module';
import { IpWhitelistMiddleware } from './middlewares/ip-whitelist.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    OtpModule,
    TokenModule,
    MailerModule,
    CategoriesModule,
    ProductsModule,
    FirebaseModule.forRoot({
      googleApplicationCredential: process.env.FIREBASE_CREDENTIALS,
    }),
    PaymentGatewayModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpWhitelistMiddleware).forRoutes('*');
  }
}
