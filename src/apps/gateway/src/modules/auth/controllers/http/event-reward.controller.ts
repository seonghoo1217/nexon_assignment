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
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../../../../../auth/src/module/schemas/role.enum';
import {
  CreateRewardDto,
  ModifyRewardDto,
} from '../../../../../../event/src/modules/dto/reward.dto';

@Controller('events/rewards')
export class EventRewardsController {
  constructor(@Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  async define(@Body() dto: CreateRewardDto) {
    return firstValueFrom(this.eventClient.send({ cmd: 'defineReward' }, dto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query('eventId') eventId?: string) {
    return firstValueFrom(this.eventClient.send({ cmd: 'getRewards' }, { eventId }));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') eventRewardId: string) {
    return firstValueFrom(this.eventClient.send({ cmd: 'getRewardById' }, { id: eventRewardId }));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  async modifyEventReward(
    @Param('id') eventRewardId: string,
    @Body() modifyRewardDto: ModifyRewardDto,
  ) {
    return firstValueFrom(
      this.eventClient.send(
        { cmd: 'modifyReward' },
        { id: eventRewardId, rewardData: modifyRewardDto },
      ),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') eventRewardId: string) {
    await firstValueFrom(this.eventClient.send({ cmd: 'deleteReward' }, { id: eventRewardId }));
    return { id: eventRewardId };
  }
}
