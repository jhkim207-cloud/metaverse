/**
 * 메뉴 API 서비스
 */

import api from './api';
import type { MenuDto } from '../types/menu.types';

export const menuApi = {
  getMenuTree: () => api.get<MenuDto[]>('/v1/menus'),
};
