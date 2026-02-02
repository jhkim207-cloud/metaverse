/**
 * Skeleton 컴포넌트 - 로딩 스켈레톤 UI
 *
 * 2025 UI 트렌드 반영:
 * - Shimmer 애니메이션
 * - Glass 효과 옵션
 * - 다양한 프리셋 (텍스트, 아바타, 카드 등)
 */

import { CSSProperties } from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'rectangular' | 'circular' | 'rounded' | 'text';
  animation?: 'shimmer' | 'pulse' | 'none';
  glass?: boolean;
  className?: string;
}

export function Skeleton({
  width,
  height,
  variant = 'rectangular',
  animation = 'shimmer',
  glass = false,
  className = '',
}: SkeletonProps) {
  const variantStyles = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-xl',
    text: 'rounded-md h-4',
  };

  const animationStyles = {
    shimmer:
      'animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%]',
    pulse: 'animate-pulse',
    none: '',
  };

  const style: CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      role="status"
      aria-label="로딩 중"
      className={`
        bg-[var(--panel-2)]
        ${variantStyles[variant]}
        ${animationStyles[animation]}
        ${glass ? 'backdrop-blur-sm bg-[var(--panel)]/40' : ''}
        ${className}
      `}
      style={style}
    >
      <span className="sr-only">로딩 중...</span>
    </div>
  );
}

interface SkeletonTextProps {
  lines?: number;
  lastLineWidth?: string;
  gap?: string;
  animation?: 'shimmer' | 'pulse' | 'none';
  className?: string;
}

export function SkeletonText({
  lines = 3,
  lastLineWidth = '60%',
  gap = '0.75rem',
  animation = 'shimmer',
  className = '',
}: SkeletonTextProps) {
  return (
    <div
      className={`flex flex-col ${className}`}
      style={{ gap }}
      role="status"
      aria-label="텍스트 로딩 중"
    >
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          animation={animation}
          width={index === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  );
}

interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animation?: 'shimmer' | 'pulse' | 'none';
  className?: string;
}

const avatarSizes = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

export function SkeletonAvatar({
  size = 'md',
  animation = 'shimmer',
  className = '',
}: SkeletonAvatarProps) {
  const dimension = avatarSizes[size];
  return (
    <Skeleton
      variant="circular"
      width={dimension}
      height={dimension}
      animation={animation}
      className={className}
    />
  );
}

interface SkeletonCardProps {
  hasImage?: boolean;
  imageHeight?: number;
  lines?: number;
  animation?: 'shimmer' | 'pulse' | 'none';
  glass?: boolean;
  className?: string;
}

export function SkeletonCard({
  hasImage = true,
  imageHeight = 160,
  lines = 3,
  animation = 'shimmer',
  glass = false,
  className = '',
}: SkeletonCardProps) {
  return (
    <div
      role="status"
      aria-label="카드 로딩 중"
      className={`
        rounded-2xl border border-[var(--border)] overflow-hidden
        ${glass ? 'bg-[var(--panel)]/60 backdrop-blur-xl' : 'bg-[var(--panel)]'}
        ${className}
      `}
    >
      {hasImage && (
        <Skeleton
          variant="rectangular"
          height={imageHeight}
          animation={animation}
          className="w-full"
        />
      )}
      <div className="p-4 space-y-3">
        <Skeleton
          variant="text"
          animation={animation}
          width="70%"
          height={20}
          className="rounded-lg"
        />
        <SkeletonText lines={lines} animation={animation} />
      </div>
    </div>
  );
}

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  animation?: 'shimmer' | 'pulse' | 'none';
  className?: string;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  animation = 'shimmer',
  className = '',
}: SkeletonTableProps) {
  return (
    <div
      role="status"
      aria-label="테이블 로딩 중"
      className={`rounded-xl border border-[var(--border)] overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex gap-4 p-4 bg-[var(--table-header)]">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" animation={animation} className="flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4 border-t border-[var(--border)]">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              animation={animation}
              className="flex-1"
              width={colIndex === 0 ? '80%' : '100%'}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
