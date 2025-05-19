import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { Role } from '../schemas/role.enum';
import { InvalidTokenException } from '../../../../../common/exceptions/custom.exception';
import { TokenPayload } from './token.payload.dto';

@Injectable()
export class JwtTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * 액세스 토큰 생성
   */
  generateAccessToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });
  }

  /**
   * 리프레시 토큰 생성
   */
  generateRefreshToken(): string {
    return randomBytes(40).toString('hex');
  }

  /**
   * 리프레시 토큰 만료일 계산
   */
  getRefreshTokenExpiry(): Date {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7); // 7일 후 만료
    return expiry;
  }

  /**
   * 토큰 검증
   */
  async validateToken(token: string) {
    try {
      return await this.jwtService.verifyAsync<TokenPayload>(token);
    } catch (error) {
      throw new InvalidTokenException();
    }
  }
}
