import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../schemas/role.enum';

@Controller()
export class AuthRpcController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: 'signUp' })
  async signUp(data: { username: string; password: string; roles?: Role[] }) {
    return await this.authService.signUp(data.username, data.password, data.roles);
  }

  @MessagePattern({ cmd: 'signIn' })
  async signIn(data: { username: string; password: string }) {
    return await this.authService.signIn(data.username, data.password);
  }

  @MessagePattern({ cmd: 'getUserById' })
  async getUserById(data: { id: string }) {
    return await this.authService.getUserById(data.id);
  }

  @MessagePattern({ cmd: 'modifyUserRoles' })
  async modifyUserRoles(data: { id: string; roles: Role[] }) {
    return await this.authService.modifyUserRoles(data.id, data.roles);
  }

  @MessagePattern({ cmd: 'refreshTokens' })
  async refreshTokens(data: { userId: string; refreshToken: string }) {
    return await this.authService.refreshTokens(data.userId, data.refreshToken);
  }

  @MessagePattern({ cmd: 'logout' })
  async logout(data: { userId: string }) {
    await this.authService.logout(data.userId);

    return { success: true };
  }
}
