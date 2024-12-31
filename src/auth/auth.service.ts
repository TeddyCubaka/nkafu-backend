import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupBodyInterface, SignupPayload } from './interfaces/signup-payload';
import { prisma } from 'src/lib/prisma';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup (user: SignupBodyInterface){
    // const verifyUser = await prisma.user.
  }
}
