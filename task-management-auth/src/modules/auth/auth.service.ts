// src/auth/auth.service.ts
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AuthEntity } from './auth.entity';
import { AuthCredentialsDto } from './dto/auth.create-user';
import { AuthRepository } from './auth.repository';
import { AuthJwtToken } from './auth.jwt-token.interface';
import { PostgresErrorCodes } from '../../constants/postgres.error-codes';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(private readonly authRepository: AuthRepository) {}

  async registerUser(createUserDto: AuthCredentialsDto): Promise<AuthEntity> {
    this.logger.log(`Creating a new user: ${JSON.stringify(createUserDto)}`);

    try {
      return await this.authRepository.addNewUser(createUserDto);
    } catch (error) {
      switch (error.code) {
        case PostgresErrorCodes.UNIQUE_VIOLATION:
          throw new ConflictException('Username already exists');
        default:
          throw new BadRequestException(`Error creating user: ${error}`);
      }
    }
  }

  async loginUser(loginUserDto: AuthCredentialsDto): Promise<AuthJwtToken> {
    await this.findUserByUsername(loginUserDto.email, true);
    return await this.authRepository.loginUser(loginUserDto);
  }

  async findUserByUsername(email: string, hideTheTrue: boolean = false): Promise<AuthEntity> {
    const result = await this.authRepository.findUserByUsername(email);
    if (!result) {
      if (hideTheTrue) {
        throw new BadRequestException('Invalid username or password');
      } else {
        throw new NotFoundException('User not found');
      }
    }
    return result;
  }

  async findUserByEmail(email: string): Promise<AuthEntity> {
    return this.findUserByUsername(email);
  }
}
