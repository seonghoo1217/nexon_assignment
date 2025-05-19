import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}

export class UserNotFoundException extends CustomException {
  constructor(userId: string) {
    super(`${userId}의 유저가 존재하지 않습니다.`, HttpStatus.NOT_FOUND);
  }
}

export class UserAlreadyExistsException extends CustomException {
  constructor(username: string) {
    super(` ${username}을 이용하는 사용자가 이미 존재합니다.`, HttpStatus.CONFLICT);
  }
}

export class InvalidCredentialsException extends CustomException {
  constructor() {
    super('아이디 혹은 비밀번호가 잘못되었습니다.', HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidTokenException extends CustomException {
  constructor() {
    super('유효하지 않은 토큰입니다.', HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidRefreshTokenException extends CustomException {
  constructor() {
    super('유효하지 않은 리프레시 토큰입니다.', HttpStatus.UNAUTHORIZED);
  }
}

export class EventNotFoundException extends CustomException {
  constructor(eventId: string) {
    super(`${eventId}의 이벤트가 존재하지 않습니다.`, HttpStatus.NOT_FOUND);
  }
}

export class RewardNotFoundException extends CustomException {
  constructor(rewardId: string) {
    super(`${rewardId}의 보상이 존재하지 않습니다.`, HttpStatus.NOT_FOUND);
  }
}

export class DuplicateRewardRequestException extends CustomException {
  constructor() {
    super('이미 해당 보상을 요청하셨습니다.', HttpStatus.CONFLICT);
  }
}
