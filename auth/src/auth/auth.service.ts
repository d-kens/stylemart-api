import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { NotificationService } from 'src/events/notification/notification.service';
import { EmailVerificationNotification } from 'src/dtos/notification-payload';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
  ) {}

  async register(userData: CreateUserDto) {
    const user = await this.userService.create(userData);

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    console.log("TOKEN: ", token)

    const verificationLink = `http://your-app.com/verify-email?token=${token}`;

    const emailVerificationData: EmailVerificationNotification = {
      clientEmail: user.email,
      verificationLink,
    };

    await this.notificationService.sendVerificationEmail(emailVerificationData);

    return {
      message:
        'Registration successful. Please check your email for verification.',
    };
  }

  async verifyEmail(token: string) {
    try {

      const decoded = this.jwtService.verify(token);
      console.log(decoded);

      // TODO: UPDATE USER isEmailVerified
      return decoded; 

    } catch (error) {

      if (error instanceof TokenExpiredError) {

        throw new BadRequestException('Verification token has expired');

      } else if (error instanceof JsonWebTokenError) {

        throw new BadRequestException('Invalid verification token');

      } else {
        throw new InternalServerErrorException('An error occurred while verifying the token');
      }
    }
  }

}
