import { RewardType } from '../schemas/enum/reward.type.enum';

export class CreateRewardDto {
  name: string;
  description: string;
  type: RewardType;
  quantity: number;
  eventId: string;
}

export class ModifyRewardDto {
  name?: string;
  description?: string;
  type?: RewardType;
  quantity?: number;
}

export class RewardResponseDto {
  id: string;
  name: string;
  description: string;
  type: RewardType;
  quantity: number;
  eventId: string;
  createdAt: Date;
  updatedAt: Date;
}
