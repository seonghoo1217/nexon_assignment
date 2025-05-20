import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../../../../../auth/src/module/schemas/role.enum';
import { firstValueFrom } from 'rxjs';
import {
  CreateRewardRequestDto,
  RewardRequestFilterDto,
} from '../../../../../../event/src/modules/dto/reward-request.dto';

@Controller('rewards')
export class RewardController {
  constructor(@Inject('EVENT_SERVICE') private eventClient: ClientProxy) {}

  /*@Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  async defineReward(@Body() rewardData: any) {
    return firstValueFrom(this.eventClient.send({ cmd: 'defineReward' }, rewardData));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getRewards(@Query('eventId') eventId?: string) {
    return firstValueFrom(this.eventClient.send({ cmd: 'getRewards' }, { eventId }));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getRewardById(@Param('id') id: string) {
    return firstValueFrom(this.eventClient.send({ cmd: 'getRewardById' }, { id }));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  async updateReward(@Param('id') id: string, @Body() rewardData: any) {
    return firstValueFrom(this.eventClient.send({ cmd: 'updateReward' }, { id, rewardData }));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteReward(@Param('id') id: string) {
    return firstValueFrom(this.eventClient.send({ cmd: 'deleteReward' }, { id }));
  }*/

  @Post('request')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async requestReward(@Req() req: Request, @Body() createRewardRequestDto: CreateRewardRequestDto) {
    const userId = (req as any).user.sub;
    return firstValueFrom(
      this.eventClient.send({ cmd: 'requestReward' }, { ...createRewardRequestDto, userId }),
    );
  }

  @Get('history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.OPERATOR, Role.AUDITOR, Role.ADMIN)
  async getRewardHistory(@Req() req: Request, @Query() filterData?: RewardRequestFilterDto) {
    const roles: Role[] = (req as any).user.roles || [];
    const isAdminOrAuditor = roles.includes(Role.ADMIN) || roles.includes(Role.AUDITOR);

    const userId = isAdminOrAuditor ? undefined : (req as any).user.sub;

    return firstValueFrom(
      this.eventClient.send({ cmd: 'getRewardHistory' }, { ...filterData, userId }),
    );
  }

  /*  @Get('requests/:id')
  @UseGuards(JwtAuthGuard)
  async getRewardRequestDetails(@Param('id') id: string) {
    return firstValueFrom(this.eventClient.send({ cmd: 'getRewardDetails' }, { id }));
  }*/

  @Post('requests/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  async approveReward(@Param('id') id: string, @Req() req: Request) {
    const adminId = (req as any).user.sub;
    return firstValueFrom(this.eventClient.send({ cmd: 'approveReward' }, { id, adminId }));
  }

  @Post('requests/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  async rejectReward(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() data: { reason: string },
  ) {
    const adminId = (req as any).user.sub;
    return firstValueFrom(
      this.eventClient.send({ cmd: 'rejectReward' }, { id, adminId, reason: data.reason }),
    );
  }
}
