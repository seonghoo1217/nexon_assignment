import { Role } from '../schemas/role.enum';

export interface TokenPayload {
  sub: string; // userId
  username: string;
  roles: Role[];
}
