import { Role } from '../../../../../../../auth/src/module/schemas/role.enum';

export class SignUpDto {
  username: string;
  password: string;
  roles?: Role[];
}
