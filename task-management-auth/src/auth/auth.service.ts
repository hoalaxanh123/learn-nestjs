// src/auth/auth.service.ts
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthEntity } from './auth.entity';
import { AuthCredentialsDto } from './dto/auth.create-user';
import { AuthRepository } from './auth.repository';
import { AuthJwtToken } from './auth.jwt-token.interface';
import { AuthJwtPayload } from './auth-jwt.payload';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(private readonly authRepository: AuthRepository) {}

  async registerUser(createUserDto: AuthCredentialsDto): Promise<AuthEntity> {
    this.logger.log(`Creating a new user: ${JSON.stringify(createUserDto)}`);
    return this.authRepository.addNewUser(createUserDto);
  }

  async loginUser(loginUserDto: AuthCredentialsDto): Promise<AuthJwtToken> {
    return await this.authRepository.loginUser(loginUserDto);
  }

  async validateUser(payload: AuthJwtPayload) {
    const user = await this.authRepository.findUserByUsername(payload.email);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
  }

  async findUserByEmail(email: string): Promise<AuthEntity> {
    return this.authRepository.findUserByUsername(email);
  }
}
