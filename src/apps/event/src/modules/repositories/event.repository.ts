import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from '../schemas/event.schema';
import { Model } from 'mongoose';
import { CreateEventDto, ModifyEventDto } from '../dto/event.dto';
import { EventStatus } from '../schemas/enum/event.status.enum';

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(Event.name)
    private readonly model: Model<EventDocument>,
  ) {}

  async create(data: CreateEventDto): Promise<EventDocument> {
    const created = new this.model({
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: data.status || EventStatus.INACTIVE,
    });
    return created.save();
  }

  async findAll(): Promise<EventDocument[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<EventDocument | null> {
    return this.model.findById(id).exec();
  }

  async update(id: string, updateData: ModifyEventDto): Promise<EventDocument | null> {
    // Convert dates to Date objects if they exist
    const processedData: any = { ...updateData };
    if (updateData.startDate) {
      processedData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      processedData.endDate = new Date(updateData.endDate);
    }

    return this.model.findByIdAndUpdate(id, processedData, { new: true }).exec();
  }

  async delete(id: string): Promise<EventDocument | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
