import { Request } from '@nestjs/common';
import { JwtPayload } from '../../../strategies/jwt.strategy';

export interface AuthenticateReqDto extends Request {
  user: JwtPayload;
}
