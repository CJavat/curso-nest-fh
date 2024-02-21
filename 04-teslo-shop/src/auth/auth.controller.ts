import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, CreateUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards( AuthGuard() ) // Manda a llamar el jwt.strategy en automatico porque se extiende de la clase: PassportStrategy( Strategy )
  testingPrivateRoute(
    // @Req() request: Express.Request,
    @GetUser() user: User
  ) {
    // console.log({ user: request.user });

    return {
      ok: true,
      message: 'Hola mundo private',
      user
    }
  }

}
