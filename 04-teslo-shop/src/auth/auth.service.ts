import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) // Ésta forma se utiliza para cuando quieres injectar (o usar) los modelos de la DB.
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 ),
      });
      
      await this.userRepository.save( user );
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };
    } catch (error) {
      console.log(error);
      this.handleDBErrors( error );
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    });
    
    if (!user)
      throw new UnauthorizedException('Invalid email');

    if( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Invalid password');

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  async checkAuthStatus( user: User ) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  private getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign( payload );
    return token;
  }

  private handleDBErrors( error: any ): never {
    if( error.code === '23505' ) 
      throw new BadRequestException( error.detail );

      console.log( error );

      throw new InternalServerErrorException('Please check server logs');
  }
}
