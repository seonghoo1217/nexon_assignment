import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../../../../../auth/src/module/schemas/role.enum';
import { CreateEventDto, ModifyEventDto } from '../../../../../../event/src/modules/dto/event.dto';

@Controller('events')
export class EventController {
  constructor(@Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  async create(@Body() dto: CreateEventDto) {
    return firstValueFrom(this.eventClient.send({ cmd: 'createEvent' }, dto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return firstValueFrom(this.eventClient.send({ cmd: 'getEvents' }, {}));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') eventId: string) {
    return firstValueFrom(this.eventClient.send({ cmd: 'getEventById' }, { id: eventId }));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  async update(@Param('id') eventId: string, @Body() modifyEventDto: ModifyEventDto) {
    return firstValueFrom(
      this.eventClient.send({ cmd: 'modifyEvent' }, { id: eventId, eventData: modifyEventDto }),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') eventId: string) {
    await firstValueFrom(this.eventClient.send({ cmd: 'deleteEvent' }, { id: eventId }));
    return { id: eventId };
  }
}
