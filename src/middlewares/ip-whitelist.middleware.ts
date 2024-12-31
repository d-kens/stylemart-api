import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpWhitelistMiddleware implements NestMiddleware {
  private readonly allowedIps = [
    '196.201.214.200',
    '196.201.214.206',
    '196.201.213.114',
    '196.201.214.207',
    '196.201.214.208',
    '196.201.213.44',
    '196.201.212.127',
    '196.201.212.138',
    '196.201.212.129',
    '196.201.212.136',
    '196.201.212.74',
    '196.201.212.69',
  ];

  use(req: Request, res: Response, next: NextFunction) {
    let clientIp =
      (req.headers['x-forwarded-for'] as string | string[]) ||
      req.socket.remoteAddress; // Use socket.remoteAddress instead of connection.remoteAddress

    // Handle the case where x-forwarded-for is an array
    if (Array.isArray(clientIp)) {
      clientIp = clientIp[0]; // Use the first IP
    }

    // Normalize IPv6-mapped IPv4 addresses
    if (clientIp && clientIp.startsWith('::ffff:')) {
      clientIp = clientIp.replace('::ffff:', '');
    }

    if (this.allowedIps.includes(clientIp)) {
      next();
    } else {
      throw new UnauthorizedException('IP not whitelisted');
    }
  }
}
