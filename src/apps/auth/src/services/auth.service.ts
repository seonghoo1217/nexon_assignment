import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Role } from '../schemas/role.enum';
import { JwtTokenService } from './jwt-token.service';
import { UserRepository } from '../repositories/user.repository';
import {
  InvalidCredentialsException,
  InvalidTokenException,
} from '../../../../common/exceptions/custom.exception';
import { UserDocument } from '../schemas/user.schema';
import { TokenPayload } from './token.payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    @Inject(forwardRef(() => JwtTokenService))
    private jwtTokenService: JwtTokenService,
  ) {}

  async signUp(username: string, password: string, roles: Role[] = [Role.USER]) {
    const created = await this.userRepository.create(username, password, roles);
    return created.id;
  }

  async signIn(username: string, password: string) {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const payload = this.createTokenPayload(user);
    const tokens = await this.generateTokens(user.id, payload);

    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
        roles: user.roles,
      },
    };
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findById(userId);
    return {
      id: user.id,
      username: user.username,
      roles: user.roles,
    };
  }

  async modifyUserRoles(userId: string, roles: Role[]) {
    const user = await this.userRepository.updateRoles(userId, roles);
    return {
      id: user.id,
      username: user.username,
      roles: user.roles,
    };
  }

  async validateToken(token: string): Promise<TokenPayload> {
    try {
      return await this.jwtTokenService.validateToken(token);
    } catch (error) {
      throw new InvalidTokenException();
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userRepository.findById(userId);

    if (!user.isRefreshTokenValid(refreshToken)) {
      throw new InvalidTokenException();
    }

    const payload = this.createTokenPayload(user);
    return this.generateTokens(user.id, payload);
  }

  async logout(userId: string) {
    await this.userRepository.updateRefreshToken(userId, null, null);
  }

  private createTokenPayload(user: UserDocument): TokenPayload {
    return {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };
  }

  private async generateTokens(userId: string, payload: TokenPayload) {
    const accessToken = this.jwtTokenService.generateAccessToken(payload);
    const refreshToken = this.jwtTokenService.generateRefreshToken();
    const refreshTokenExpiry = this.jwtTokenService.getRefreshTokenExpiry();

    await this.userRepository.updateRefreshToken(userId, refreshToken, refreshTokenExpiry);

    return {
      accessToken,
      refreshToken,
    };
  }
}
