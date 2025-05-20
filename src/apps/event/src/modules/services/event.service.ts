import { Injectable, BadRequestException } from '@nestjs/common';
import { Event } from '../schemas/event.schema';
import { EventRepository } from '../repositories/event.repository';
import { EventNotFoundException } from 'src/common/exceptions/custom.exception';
import { CreateEventDto, EventResponseDto, ModifyEventDto } from '../dto/event.dto';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async createEvent(data: CreateEventDto) {
    if (new Date(data.startDate) > new Date(data.endDate)) {
      throw new BadRequestException('Start date must be before end date');
    }

    const event = await this.eventRepository.create(data);
    return this.mapToResponseDto(event);
  }

  async getEvents(): Promise<EventResponseDto[]> {
    const events = await this.eventRepository.findAll();
    return events.map((event) => this.mapToResponseDto(event));
  }

  async getEventById(id: string): Promise<EventResponseDto> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new EventNotFoundException(id);
    }
    return this.mapToResponseDto(event);
  }

  async modifyEvent(id: string, eventData: ModifyEventDto): Promise<EventResponseDto> {
    // Validate event dates if both are provided
    if (eventData.startDate && eventData.endDate) {
      if (new Date(eventData.startDate) > new Date(eventData.endDate)) {
        throw new BadRequestException('Start date must be before end date');
      }
    }

    // Check if event exists
    const existingEvent = await this.eventRepository.findById(id);
    if (!existingEvent) {
      throw new EventNotFoundException(id);
    }

    // If only one date is provided, validate against the existing date
    if (eventData.startDate && !eventData.endDate) {
      if (new Date(eventData.startDate) > new Date(existingEvent.endDate)) {
        throw new BadRequestException('Start date must be before end date');
      }
    }

    if (!eventData.startDate && eventData.endDate) {
      if (new Date(existingEvent.startDate) > new Date(eventData.endDate)) {
        throw new BadRequestException('Start date must be before end date');
      }
    }

    const updated = await this.eventRepository.update(id, eventData);
    return this.mapToResponseDto(updated);
  }

  async deleteEvent(id: string): Promise<EventResponseDto> {
    const existingEvent = await this.eventRepository.findById(id);
    if (!existingEvent) {
      throw new EventNotFoundException(id);
    }

    const deleted = await this.eventRepository.delete(id);
    return this.mapToResponseDto(deleted);
  }

  private mapToResponseDto(event: any): EventResponseDto {
    return {
      id: event._id.toString(),
      name: event.name,
      description: event.description,
      conditions: event.conditions,
      startDate: event.startDate,
      endDate: event.endDate,
      status: event.status,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }
}
