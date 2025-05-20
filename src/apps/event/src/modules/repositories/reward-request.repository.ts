import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RewardRequest, RewardRequestDocument } from '../schemas/reward-request.schema';
import { Model } from 'mongoose';
import { RequestStatus } from '../schemas/enum/request.status.enum';
import { RewardNotFoundException } from '../../../../../common/exceptions/custom.exception';

@Injectable()
export class RewardRequestRepository {
  constructor(
    @InjectModel(RewardRequest.name)
    private readonly model: Model<RewardRequestDocument>,
  ) {}

  async create(data: { userId: string; rewardId: string; status?: RequestStatus }) {
    const created = new this.model({
      ...data,
      status: data.status || RequestStatus.PENDING,
    });
    return created.save();
  }

  async findAll(filter: { userId?: string; status?: RequestStatus } = {}) {
    const query: any = {};

    if (filter.userId) {
      query.userId = filter.userId;
    }

    if (filter.status) {
      query.status = filter.status;
    }

    return this.model.find(query).populate('rewardId').exec();
  }

  async findById(id: string) {
    return this.model.findById(id).populate('rewardId').exec();
  }

  async findOne(filter: {
    userId: string;
    rewardId: string;
    status?: RequestStatus | RequestStatus[];
  }) {
    const query: any = {
      userId: filter.userId,
      rewardId: filter.rewardId,
    };

    if (filter.status) {
      query.status = filter.status;
    }

    return this.model.findOne(query).exec();
  }

  async approve(id: string, adminId: string) {
    return this.model
      .findByIdAndUpdate(
        id,
        {
          status: RequestStatus.APPROVED,
          approvedBy: adminId,
          approvedAt: new Date(),
        },
        { new: true },
      )
      .orFail(() => new RewardNotFoundException('해당 Reward가 존재하지 않습니다.'))
      .exec();
  }

  async reject(id: string, adminId: string, reason: string) {
    return this.model
      .findByIdAndUpdate(
        id,
        {
          status: RequestStatus.REJECTED,
          approvedBy: adminId,
          rejectionReason: reason,
        },
        { new: true },
      )
      .orFail(() => new RewardNotFoundException('해당 Reward가 존재하지 않습니다.'))
      .exec();
  }

  async complete(id: string) {
    return this.model
      .findByIdAndUpdate(
        id,
        {
          status: RequestStatus.COMPLETED,
        },
        { new: true },
      )
      .orFail(() => new RewardNotFoundException('해당 Reward가 존재하지 않습니다.'))
      .exec();
  }
}
