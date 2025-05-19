import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { GatewayModule } from './modules/gateway/gateway.module';
import { HealthModule } from './modules/health/health.module';
import { AuthController } from './modules/auth/controllers/http/auth.controller';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (cs) => ({
          transport: Transport.TCP,
          options: {
            host: cs.get('AUTH_SERVICE_HOST'),
            port: +cs.get('AUTH_SERVICE_PORT'),
          },
        }),
      },
    ]),

    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs) => ({
        secret: cs.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),

    GatewayModule,
    HealthModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtModule],
})
export class AppModule {}
