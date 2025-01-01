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
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../.env'), // Adjust the path as needed
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    OtpModule,
    TokenModule,
    MailerModule,
    CategoriesModule,
    ProductsModule,
    FirebaseModule.forRoot({
      googleApplicationCredential: path.resolve(__dirname, '../../firebase-service-account.json'),
    }),
    PaymentGatewayModule,
  ],
})
export class AppModule {}


