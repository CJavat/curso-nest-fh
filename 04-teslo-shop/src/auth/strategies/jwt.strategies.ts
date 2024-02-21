import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";

import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

  constructor(
    @InjectRepository( User )
    private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'), // Variable de entorno
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
  }

  async validate( payload: JwtPayload ): Promise<User> { // Debe estar declarado el método con el nombre de "validate"

    const { id } = payload;

    const user = await this.userRepository.findOneBy({ id });
    if( !user )
      throw new UnauthorizedException('Token not valid');
    if( !user.isActive )
      throw new UnauthorizedException('User is not active, talk with an admin');
    console.log(!user.isActive);
    return user;
  }
}