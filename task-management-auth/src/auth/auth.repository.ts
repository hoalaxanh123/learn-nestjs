// src/auth/auth.repository.ts
import { DataSource, Repository } from 'typeorm';
import { AuthEntity } from './auth.entity';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth.create-user';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './auth-jwt.payload';
import { AuthJwtToken } from './auth.jwt-token.interface';

@Injectable()
export class AuthRepository extends Repository<AuthEntity> {
  private logger = new Logger('AuthRepository');

  // Dependency injection of the JwtService
  constructor(
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) {
    super(AuthEntity, dataSource.createEntityManager());
  }

  async addNewUser(createUserDto: AuthCredentialsDto): Promise<AuthEntity> {
    this.logger.log(`Creating a new user: ${JSON.stringify(createUserDto)}`);
    try {
      const user = this.create(createUserDto);
      const result = await this.save(user);
      console.log('result: ', result);
      return result;
    } catch (error) {
      switch (error.code) {
        case '23505':
          throw new ConflictException('Username already exists');
        default:
          throw new BadRequestException(`Error creating user: ${error}`);
      }
    }
  }

  async findUserByUsername(
    email: string,
    hideTheTrue: boolean = false,
  ): Promise<AuthEntity> {
    const result = await this.findOneBy({ email });
    if (!result) {
      if (hideTheTrue) {
        throw new BadRequestException('Invalid username or password');
      } else {
        throw new NotFoundException('User not found');
      }
    }
    return result;
  }

  async loginUser(loginUserDto: AuthCredentialsDto): Promise<AuthJwtToken> {
    const { email, password } = loginUserDto;
    const user = await this.findUserByUsername(email, true);
    if (!(await compare(password, user.password))) {
      throw new BadRequestException('Invalid username or password');
    }
    const payload: AuthJwtPayload = { email };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
