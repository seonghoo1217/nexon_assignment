import { Injectable } from '@nestjs/common';
import { RewardRepository } from '../repositories/reward.repository';
import { EventRepository } from '../repositories/event.repository';
import { CreateRewardDto, RewardResponseDto, ModifyRewardDto } from '../dto/reward.dto';
import {
  RewardNotFoundException,
  EventNotFoundException,
} from '../../../../../common/exceptions/custom.exception';

@Injectable()
export class RewardService {
  constructor(
    private readonly rewardRepo: RewardRepository,
    private readonly eventRepo: EventRepository,
  ) {}

  async createReward(createRewardDto: CreateRewardDto): Promise<RewardResponseDto> {
    const event = await this.eventRepo.findById(createRewardDto.eventId);
    if (!event) {
      throw new EventNotFoundException(createRewardDto.eventId);
    }

    // Create reward
    const reward = await this.rewardRepo.create(createRewardDto);
    return this.mapToResponseDto(reward);
  }

  async getRewards(eventId?: string): Promise<RewardResponseDto[]> {
    if (eventId) {
      const event = await this.eventRepo.findById(eventId);
      if (!event) {
        throw new EventNotFoundException(eventId);
      }
    }

    const rewards = await this.rewardRepo.findAll({ eventId });
    return rewards.map((reward) => this.mapToResponseDto(reward));
  }

  async getRewardById(id: string) {
    const reward = await this.rewardRepo.findById(id);
    if (!reward) {
      throw new RewardNotFoundException(id);
    }
    return this.mapToResponseDto(reward);
  }

  async modifyReward(id: string, updateRewardDto: ModifyRewardDto): Promise<RewardResponseDto> {
    const existingReward = await this.rewardRepo.findById(id);
    if (!existingReward) {
      throw new RewardNotFoundException(id);
    }

    const updatedReward = await this.rewardRepo.update(id, updateRewardDto);
    return this.mapToResponseDto(updatedReward);
  }

  async deleteReward(id: string): Promise<RewardResponseDto> {
    const existingReward = await this.rewardRepo.findById(id);
    if (!existingReward) {
      throw new RewardNotFoundException(id);
    }

    const deletedReward = await this.rewardRepo.delete(id);
    return this.mapToResponseDto(deletedReward);
  }

  private mapToResponseDto(reward: any): RewardResponseDto {
    return {
      id: reward._id.toString(),
      name: reward.name,
      description: reward.description,
      type: reward.type,
      quantity: reward.quantity,
      eventId: reward.eventId.toString(),
      createdAt: reward.createdAt,
      updatedAt: reward.updatedAt,
    };
  }
}
