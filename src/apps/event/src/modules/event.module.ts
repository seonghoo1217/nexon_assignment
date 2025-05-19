import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventRpcController } from './controllers/event.rpc.controller';
import { Event, EventSchema } from './schemas/event.schema';
import { Reward, RewardSchema } from './schemas/reward.schema';
import { RewardRequest, RewardRequestSchema } from './schemas/reward-request.schema';
import { EventRepository } from './repositories/event.repository';
import { RewardRepository } from './repositories/reward.repository';
import { RewardRequestRepository } from './repositories/reward-request.repository';
import { EventService } from './services/event.service';
import { RewardService } from './services/reward.service';
import { RewardRequestService } from './services/reward-request.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RewardRpcController } from './controllers/reward.rpc.controller';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'EVENT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (cs: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: cs.get('EVENT_SERVICE_HOST'),
            port: cs.get<number>('EVENT_SERVICE_PORT'),
          },
        }),
      },
    ]),
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
  ],
  controllers: [EventRpcController, RewardRpcController],
  providers: [
    EventRepository,
    RewardRepository,
    RewardRequestRepository,
    EventService,
    RewardService,
    RewardRequestService,
  ],
})
export class EventModule {}
