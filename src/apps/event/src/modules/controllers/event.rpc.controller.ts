import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventService } from '../services/event.service';
import { CreateEventDto, EventResponseDto, ModifyEventDto } from '../dto/event.dto';

@Controller()
export class EventRpcController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern({ cmd: 'createEvent' })
  async createEvent(data: CreateEventDto) {
    return this.eventService.createEvent(data);
  }

  @MessagePattern({ cmd: 'getEvents' })
  async getEvents() {
    return this.eventService.getEvents();
  }

  @MessagePattern({ cmd: 'getEventById' })
  async getEventById(data: { id: string }) {
    return this.eventService.getEventById(data.id);
  }

  @MessagePattern({ cmd: 'modifyEvent' })
  async modifyEvent(data: { id: string; eventData: ModifyEventDto }) {
    return this.eventService.modifyEvent(data.id, data.eventData);
  }

  @MessagePattern({ cmd: 'deleteEvent' })
  async deleteEvent(data: { id: string }) {
    return this.eventService.deleteEvent(data.id);
  }
}
