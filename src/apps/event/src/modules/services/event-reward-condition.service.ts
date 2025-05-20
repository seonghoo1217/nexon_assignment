import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ConditionService {
  async validate(condition: string, userId: string): Promise<boolean> {
    switch (condition) {
      case 'login_7_days':
        return await this.checkLoginStreak(userId, 7);
      case 'invite_3_friends':
        return await this.checkInvites(userId, 3);
      default:
        throw new BadRequestException(`알 수 없는 이벤트 조건: ${condition}`);
    }
  }

  private async checkLoginStreak(userId: string, days: number) {
    // TODO 로그인 기록 테이블에서 연속 로그인 일수 계산 로직
    return true;
  }

  private async checkInvites(userId: string, count: number) {
    //TODO 친구 초대 기록 집계 로직

    return true;
  }
}
