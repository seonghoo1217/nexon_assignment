// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // .env 로부터 MONGO_URI 를 읽어올 수 있게 해 주는 설정
    ConfigModule.forRoot({ isGlobal: true }),

    // MongoDB 커넥션 설정 — 반드시 한 번만 전역으로 등록
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        uri: cs.get<string>('MONGO_URI'),
      }),
    }),

    // AuthModule 등 기능별 모듈들
    AuthModule,
  ],
})
export class AppModule {}
