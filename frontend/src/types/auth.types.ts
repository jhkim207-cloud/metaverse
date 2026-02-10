import type { MenuDto } from './menu.types';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  username: string;
  displayName: string;
  employeeId: string;
  email: string;
  roles: string[];
  menus: MenuDto[];
}
