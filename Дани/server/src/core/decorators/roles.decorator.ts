import { SetMetadata } from '@nestjs/common';
import { ROLES } from '../constants';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const IsAdmin = () => Roles(ROLES.ADMIN);
export const IsManager = () => Roles(ROLES.MANAGER);
export const IsUser = () => Roles(ROLES.USER); 