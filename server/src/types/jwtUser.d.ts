import { UserRole } from 'src/users/dto/create-user.dto';

export interface currentUser {
  id: string;
  role: UserRole;
}
