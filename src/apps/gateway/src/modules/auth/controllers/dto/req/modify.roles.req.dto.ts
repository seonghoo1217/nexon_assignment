import { Role } from '../../../../../../../auth/src/schemas/role.enum';

export class ModifyRolesDto {
  id: String;
  roles: Role[];
}
