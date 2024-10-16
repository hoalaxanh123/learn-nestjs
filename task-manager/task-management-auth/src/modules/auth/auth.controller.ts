import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth.create-user';
import { AuthJwtToken } from './auth.jwt-token.interface';
import { GetUser } from './get-user.decorator';
import { AuthEntity } from './auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async registerUser(@Body() createUserDto: AuthCredentialsDto): Promise<void> {
    await this.authService.registerUser(createUserDto);
  }

  @Post('/login')
  @HttpCode(200)
  async loginUser(@Body() loginUserDto: AuthCredentialsDto): Promise<AuthJwtToken> {
    return this.authService.loginUser(loginUserDto);
  }

  @Post('/user-info')
  @HttpCode(200)
  async getUserInfo(@GetUser() user: AuthEntity): Promise<AuthEntity> {
    console.log('user: ', user);
    return user;
  }
}
