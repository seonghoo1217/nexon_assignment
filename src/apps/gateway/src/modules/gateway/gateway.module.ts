import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayController } from './controllers/gateway.controller';
import { AuthController } from '../auth/controllers/http/auth.controller';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (cs) => ({
          transport: Transport.TCP,
          options: {
            host: cs.get('AUTH_SERVICE_HOST', 'auth-service'),
            port: cs.get('AUTH_SERVICE_PORT', 8001),
          },
        }),
      },
      {
        name: 'EVENT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (cs) => ({
          transport: Transport.TCP,
          options: {
            host: cs.get('EVENT_SERVICE_HOST', 'event-service'),
            port: cs.get('EVENT_SERVICE_PORT', 8002),
          },
        }),
      },
    ]),
  ],
  controllers: [GatewayController, AuthController],
})
export class GatewayModule {}
