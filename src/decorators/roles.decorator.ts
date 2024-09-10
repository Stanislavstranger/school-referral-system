import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/user/interfaces/user.interface';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
