import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../../../../../auth/src/module/schemas/role.enum';
import { SignUpDto } from '../dto/req/register.req.dto';
import { SignInDto } from '../dto/req/login.req.dto';
import { ModifyRolesDto } from '../dto/req/modify.roles.req.dto';
import { AuthenticateReqDto } from '../dto/req/auth.req.dto';
import { RefreshTokenDto } from '../dto/req/refresh-token.req.dto';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Post('signUp')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto) {
    return firstValueFrom(this.authClient.send({ cmd: 'signUp' }, signUpDto));
  }

  @Post('signIn')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    return this.authClient.send({ cmd: 'signIn' }, signInDto);
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.AUDITOR)
  async getUserById(@Param('id') userId: string) {
    return this.authClient.send({ cmd: 'getUserById' }, { id: userId });
  }

  @Patch('users/:id/roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async modifyUserRoles(@Param('id') userId: string, @Body() modifyRolesDto: ModifyRolesDto) {
    return this.authClient.send(
      { cmd: 'modifyUserRoles' },
      { id: userId, roles: modifyRolesDto.roles },
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: AuthenticateReqDto) {
    return this.authClient.send({ cmd: 'getUserById' }, { id: req.user.sub });
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authClient.send({ cmd: 'refreshTokens' }, refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req: AuthenticateReqDto) {
    await firstValueFrom(
      this.authClient.send<{ success: true }>({ cmd: 'logout' }, { userId: req.user.sub }),
    );
  }
}
