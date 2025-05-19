import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { User, UserSchema } from './schemas/user.schema';
import { JwtTokenService } from './services/jwt-token.service';
import { UserRepository } from './repositories/user.repository';
import { AuthRpcController } from './controllers/rpc/auth.rpc.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthRpcController],
  providers: [AuthService, JwtTokenService, UserRepository],
})
export class AuthModule {}
