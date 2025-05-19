import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// Import the Role enum from the shared location
import { Role } from '../../../../../auth/src/module/schemas/role.enum';
import { TokenPayload } from 'src/apps/auth/src/module/services/token.payload.dto';
import { AuthService } from '../../../../../auth/src/module/services/auth.service';

export interface JwtPayload {
  sub: string;
  username: string;
  roles: Role[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    return payload;
  }
}
