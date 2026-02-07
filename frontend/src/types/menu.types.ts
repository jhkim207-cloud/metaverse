/**
 * 메뉴 타입 정의
 */

export interface MenuDto {
  id: number;
  code: string;
  name: string;
  parentId: number | null;
  path: string | null;
  icon: string | null;
  menuType: 'GROUP' | 'MENU' | 'LINK';
  sortOrder: number;
  isActive: boolean;
  depth: number;
  children: MenuDto[];
}
