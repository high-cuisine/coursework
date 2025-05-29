import { SetMetadata } from '@nestjs/common';
import { Role, ROLES_KEY } from '../types/roles.enum';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const IsAdmin = () => Roles(Role.ADMIN);
export const IsManager = () => Roles(Role.MANAGER);
export const IsUser = () => Roles(Role.USER); 