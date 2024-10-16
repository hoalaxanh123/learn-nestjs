import { DataSource, Repository } from 'typeorm';
import { AuthEntity } from './auth.entity';
import { Injectable, Logger } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth.create-user';
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
    const user = this.create(createUserDto);
    return await this.save(user);
  }

  async findUserByUsername(email: string): Promise<AuthEntity> {
    const result = await this.findOneBy({ email });
    if (!result) {
      this.logger.log(`User with email ${email} not found`);
    }
    return result;
  }

  async loginUser(loginUserDto: AuthCredentialsDto): Promise<AuthJwtToken> {
    const { email } = loginUserDto;
    const payload: AuthJwtPayload = { email };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
