import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RewardService } from '../services/reward.service';
import { RewardRequestService } from '../services/reward-request.service';
import { CreateRewardDto, ModifyRewardDto } from '../dto/reward.dto';
import {
  CreateRewardRequestDto,
  ApproveRewardRequestDto,
  RejectRewardRequestDto,
  RewardRequestFilterDto,
} from '../dto/reward-request.dto';

@Controller()
export class RewardRpcController {
  constructor(
    private readonly rewardService: RewardService,
    private readonly rewardRequestService: RewardRequestService,
  ) {}

  @MessagePattern({ cmd: 'defineReward' })
  async defineReward(data: CreateRewardDto) {
    return this.rewardService.createReward(data);
  }

  @MessagePattern({ cmd: 'getRewards' })
  async getRewards(data: { eventId?: string }) {
    return this.rewardService.getRewards(data.eventId);
  }

  @MessagePattern({ cmd: 'getRewardById' })
  async getRewardById(data: { id: string }) {
    return this.rewardService.getRewardById(data.id);
  }

  @MessagePattern({ cmd: 'modifyReward' })
  async modifyReward(data: { id: string; rewardData: ModifyRewardDto }) {
    return this.rewardService.modifyReward(data.id, data.rewardData);
  }

  @MessagePattern({ cmd: 'deleteReward' })
  async deleteReward(data: { id: string }) {
    return this.rewardService.deleteReward(data.id);
  }

  @MessagePattern({ cmd: 'requestReward' })
  async requestReward(data: CreateRewardRequestDto) {
    return this.rewardRequestService.requestReward(data);
  }

  @MessagePattern({ cmd: 'getRewardHistory' })
  async getRewardHistory(data: RewardRequestFilterDto) {
    return this.rewardRequestService.getRewardRequests(data);
  }

  @MessagePattern({ cmd: 'getRewardDetails' })
  async getRewardDetails(data: { id: string }) {
    return this.rewardRequestService.getRewardRequestById(data.id);
  }

  @MessagePattern({ cmd: 'approveReward' })
  async approveReward(data: { id: string; adminId: string }) {
    const approveDto: ApproveRewardRequestDto = { adminId: data.adminId };
    return this.rewardRequestService.approveRewardRequest(data.id, approveDto);
  }

  @MessagePattern({ cmd: 'rejectReward' })
  async rejectReward(data: { id: string; adminId: string; reason: string }) {
    const rejectDto: RejectRewardRequestDto = {
      adminId: data.adminId,
      reason: data.reason,
    };
    return this.rewardRequestService.rejectRewardRequest(data.id, rejectDto);
  }
}
