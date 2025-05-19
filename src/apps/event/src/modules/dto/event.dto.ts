import { EventStatus } from '../schemas/enum/event.status.enum';
import { IsDateString, IsEnum } from 'class-validator';

export class CreateEventDto {
  name: string;
  description: string;
  conditions: string;
  @IsDateString()
  startDate: Date;
  @IsDateString()
  endDate: Date;
  @IsEnum(EventStatus)
  status: EventStatus;
}

export class ModifyEventDto {
  name?: string;
  description?: string;
  conditions?: string;
  @IsDateString()
  startDate?: Date;
  @IsDateString()
  endDate?: Date;
  @IsEnum(EventStatus)
  status?: EventStatus;
}

export class EventResponseDto {
  id: string;
  name: string;
  description: string;
  conditions: string;
  startDate: Date;
  endDate: Date;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}
