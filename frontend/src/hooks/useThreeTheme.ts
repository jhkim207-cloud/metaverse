/**
 * useThreeTheme - CSS 변수를 Three.js 소재 설정으로 변환하는 훅
 *
 * data-theme 변경을 감지하여 Light/Dark 모드에 맞는
 * Three.js MeshPhysicalMaterial 파라미터를 자동 생성한다.
 */

import { useState, useEffect, useCallback } from 'react';
import type { ThreeMaterialConfig } from '../types/three.types';

const LIGHT_CONFIG: ThreeMaterialConfig = {
  panelColor: '#ffffff',
  panelOpacity: 0.72,
  accentColor: '#1e3a5f',
  textColor: '#1d1d1f',
  bgColor: '#f0f2f5',
  successColor: '#30d158',
  warningColor: '#ff9f0a',
  errorColor: '#ff453a',
  ambientIntensity: 0.6,
  directionalIntensity: 0.8,
};

const DARK_CONFIG: ThreeMaterialConfig = {
  panelColor: '#1e1e23',
  panelOpacity: 0.72,
  accentColor: '#1e3a5f',
  textColor: '#f5f5f7',
  bgColor: '#0a0a0c',
  successColor: '#30d158',
  warningColor: '#ff9f0a',
  errorColor: '#ff453a',
  ambientIntensity: 0.3,
  directionalIntensity: 0.5,
};

function getIsDark(): boolean {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

export function useThreeTheme(): ThreeMaterialConfig & { isDark: boolean } {
  const [isDark, setIsDark] = useState(getIsDark);

  const handleThemeChange = useCallback(() => {
    setIsDark(getIsDark());
  }, []);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-theme') {
          handleThemeChange();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, [handleThemeChange]);

  const config = isDark ? DARK_CONFIG : LIGHT_CONFIG;
  return { ...config, isDark };
}
