import { RequestStatus } from '../schemas/enum/request.status.enum';
import { RewardResponseDto } from './reward.dto';

export class CreateRewardRequestDto {
  userId: string;
  rewardId: string;
}

export class ApproveRewardRequestDto {
  adminId: string;
}

export class RejectRewardRequestDto {
  adminId: string;
  reason: string;
}

export class RewardRequestFilterDto {
  status?: RequestStatus;
}

export class RewardRequestResponseDto {
  id: string;
  userId: string;
  // rewardId: string;
  reward?: RewardResponseDto;
  status: RequestStatus;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
