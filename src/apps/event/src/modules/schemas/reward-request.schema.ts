import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Reward } from './reward.schema';
import { RequestStatus } from './enum/request.status.enum';

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
})
export class RewardRequest {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Reward', required: true })
  rewardId: Reward;

  @Prop({
    type: String,
    enum: RequestStatus,
    default: RequestStatus.PENDING,
    required: true,
  })
  status: RequestStatus;

  @Prop()
  approvedBy: string;

  @Prop()
  approvedAt: Date;

  @Prop()
  rejectionReason: string;
}

export type RewardRequestDocument = HydratedDocument<RewardRequest>;
export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);

RewardRequestSchema.index(
  { userId: 1, rewardId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: RequestStatus.PENDING },
  },
);
