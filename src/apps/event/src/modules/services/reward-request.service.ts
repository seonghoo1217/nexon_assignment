import { ForbiddenException, Injectable } from '@nestjs/common';
import { RewardRequestRepository } from '../repositories/reward-request.repository';
import { RewardRepository } from '../repositories/reward.repository';
import {
  CreateRewardRequestDto,
  ApproveRewardRequestDto,
  RejectRewardRequestDto,
  RewardRequestFilterDto,
  RewardRequestResponseDto,
} from '../dto/reward-request.dto';
import {
  RewardNotFoundException,
  DuplicateRewardRequestException,
} from '../../../../../common/exceptions/custom.exception';
import { RequestStatus } from '../schemas/enum/request.status.enum';
import { RewardService } from './reward.service';
import { EventService } from './event.service';
import { ConditionService } from './event-reward-condition.service';

@Injectable()
export class RewardRequestService {
  constructor(
    private readonly rewardRequestRepo: RewardRequestRepository,
    private readonly rewardRepo: RewardRepository,
    private readonly rewardService: RewardService,
    private eventService: EventService,
    private conditionService: ConditionService,
  ) {}

  async requestReward(createRewardRequestDto: CreateRewardRequestDto) {
    const reward = await this.rewardRepo.findById(createRewardRequestDto.rewardId);
    if (!reward) {
      throw new RewardNotFoundException(createRewardRequestDto.rewardId);
    }

    const event = await this.eventService.getEventById(reward.eventId.toString());

    // 조건 검증 로직
    const ok = await this.conditionService.validate(
      event.conditions,
      createRewardRequestDto.userId,
    );

    if (!ok) {
      throw new ForbiddenException(`이벤트 조건을 만족하지 않습니다: ${event.conditions}`);
    }

    const existingRequest = await this.rewardRequestRepo.findOne({
      userId: createRewardRequestDto.userId,
      rewardId: createRewardRequestDto.rewardId,
      status: [RequestStatus.PENDING, RequestStatus.APPROVED, RequestStatus.COMPLETED],
    });

    if (existingRequest) {
      throw new DuplicateRewardRequestException();
    }

    const rewardRequest = await this.rewardRequestRepo.create(createRewardRequestDto);
    return this.mapToResponseDto(rewardRequest);
  }

  async getRewardRequests(filter: RewardRequestFilterDto) {
    const rewardRequests = await this.rewardRequestRepo.findAll(filter);

    const responsePromises = rewardRequests.map(async (request) => {
      const rewardId =
        typeof request.rewardId === 'object' && '_id' in request.rewardId
          ? (request.rewardId as any)._id.toString()
          : request.rewardId.toString();

      const reward = await this.rewardService.getRewardById(rewardId);
      return this.mapToResponseDto(request, reward);
    });

    return Promise.all(responsePromises);
  }

  async getRewardRequestById(id: string): Promise<RewardRequestResponseDto> {
    const rewardRequest = await this.rewardRequestRepo.findById(id);
    if (!rewardRequest) {
      throw new RewardNotFoundException(id);
    }

    // Get reward details
    const reward = await this.rewardService.getRewardById(rewardRequest.rewardId.toString());
    return this.mapToResponseDto(rewardRequest, reward);
  }

  async approveRewardRequest(
    id: string,
    approveDto: ApproveRewardRequestDto,
  ): Promise<RewardRequestResponseDto> {
    const existingRequest = await this.rewardRequestRepo.findById(id);
    if (!existingRequest) {
      throw new RewardNotFoundException(id);
    }

    const updatedRequest = await this.rewardRequestRepo.approve(id, approveDto.adminId);

    const reward = await this.rewardService.getRewardById(updatedRequest.rewardId.toString());
    return this.mapToResponseDto(updatedRequest, reward);
  }

  async rejectRewardRequest(id: string, rejectDto: RejectRewardRequestDto) {
    const existingRequest = await this.rewardRequestRepo.findById(id);
    if (!existingRequest) {
      throw new RewardNotFoundException(id);
    }

    const updatedRequest = await this.rewardRequestRepo.reject(
      id,
      rejectDto.adminId,
      rejectDto.reason,
    );

    const reward = await this.rewardService.getRewardById(updatedRequest.rewardId.toString());
    return this.mapToResponseDto(updatedRequest, reward);
  }

  async completeRewardRequest(id: string) {
    const existingRequest = await this.rewardRequestRepo.findById(id);
    if (!existingRequest) {
      throw new RewardNotFoundException(id);
    }

    const updatedRequest = await this.rewardRequestRepo.complete(id);

    const reward = await this.rewardService.getRewardById(updatedRequest.rewardId.toString());
    return this.mapToResponseDto(updatedRequest, reward);
  }

  private mapToResponseDto(rewardRequest: any, reward?: any): RewardRequestResponseDto {
    return {
      id: rewardRequest._id.toString(),
      userId: rewardRequest.userId,
      // rewardId: rewardRequest.rewardId.toString(),
      reward: reward,
      status: rewardRequest.status,
      approvedBy: rewardRequest.approvedBy,
      approvedAt: rewardRequest.approvedAt,
      rejectionReason: rewardRequest.rejectionReason,
      createdAt: rewardRequest.createdAt,
      updatedAt: rewardRequest.updatedAt,
    };
  }
}
