import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Role } from '../schemas/role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { JwtPayload } from '../strategies/jwt.strategy';
import { SignUpDto } from './dto/req/register.req.dto';
import { SignInDto } from './dto/req/login.req.dto';
import { ModifyRolesDto } from './dto/req/modify.roles.req.dto';
import { RefreshTokenDto } from './dto/req/refresh-token.req.dto';
import { AuthenticateReqDto } from './dto/req/auth.req.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto.username, signUpDto.password, signUpDto.roles);
  }

  @Post('signIn')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.AUDITOR)
  async getUserById(@Param('id') id: string) {
    return await this.authService.getUserById(id);
  }

  @Put('users/:id/roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateUserRoles(@Param('id') id: string, @Body() modifyRolesDto: ModifyRolesDto) {
    return await this.authService.updateUserRoles(id, modifyRolesDto.roles);
  }

  @Get('users/me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: AuthenticateReqDto) {
    return await this.authService.getUserById(req.user.sub);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.userId, refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req: AuthenticateReqDto) {
    await this.authService.logout(req.user.sub);
  }
}
