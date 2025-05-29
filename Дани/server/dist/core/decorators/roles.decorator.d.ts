import { Role } from '../types/roles.enum';
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const IsAdmin: () => import("@nestjs/common").CustomDecorator<string>;
export declare const IsManager: () => import("@nestjs/common").CustomDecorator<string>;
export declare const IsUser: () => import("@nestjs/common").CustomDecorator<string>;
