/**
 * 메뉴 데이터 조회 훅
 */

import { useState, useEffect } from 'react';
import { menuApi } from '../services/menuApi';
import type { MenuDto } from '../types/menu.types';

export function useMenus() {
  const [menus, setMenus] = useState<MenuDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMenus() {
      try {
        const response = await menuApi.getMenuTree();
        if (!cancelled) {
          if (response.success && response.data) {
            setMenus(response.data);
          } else {
            setError(response.message || '메뉴 조회 실패');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '메뉴 조회 실패');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMenus();

    return () => {
      cancelled = true;
    };
  }, []);

  return { menus, loading, error };
}
