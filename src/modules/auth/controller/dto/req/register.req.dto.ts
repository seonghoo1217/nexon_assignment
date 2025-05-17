import { Role } from '../../../schemas/role.enum';

export class SignUpDto {
  username: string;
  password: string;
  roles?: Role[];
}
