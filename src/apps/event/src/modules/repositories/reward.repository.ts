import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reward, RewardDocument } from '../schemas/reward.schema';
import { Model } from 'mongoose';
import { RewardType } from '../schemas/enum/reward.type.enum';

@Injectable()
export class RewardRepository {
  constructor(
    @InjectModel(Reward.name)
    private readonly model: Model<RewardDocument>,
  ) {}

  async create(data: {
    name: string;
    description: string;
    type: RewardType;
    quantity: number;
    eventId: string;
  }) {
    const created = new this.model(data);
    return created.save();
  }

  async findAll(filter: { eventId?: string } = {}) {
    const query = filter.eventId ? { eventId: filter.eventId } : {};
    return this.model.find(query).exec();
  }

  async findById(id: string) {
    return this.model.findById(id).exec();
  }

  async update(id: string, updateData: Partial<Reward>) {
    return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id).exec();
  }
}