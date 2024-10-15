// Implement the JwtStrategy class extends from PassportStrategy
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthJwtPayload } from './auth-jwt.payload';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { AuthEntity } from './auth.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(AuthRepository) private authRepository: AuthRepository,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'topSecret51',
    });
  }

  // Implement the validate method
  async validate(payload: AuthJwtPayload): Promise<AuthEntity> {
    const { email } = payload;
    return await this.authService.findUserByEmail(email);
  }
}
