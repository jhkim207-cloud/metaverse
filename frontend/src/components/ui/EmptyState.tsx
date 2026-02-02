/**
 * EmptyState 컴포넌트 - 빈 상태 표시
 */

import { ReactNode } from 'react';
import { Inbox, Search, FileX, FolderOpen } from 'lucide-react';
import { Button } from './Button';

type EmptyStateVariant = 'default' | 'search' | 'error' | 'folder';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  icon?: ReactNode;
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const variantConfig: Record<
  EmptyStateVariant,
  { icon: ReactNode; title: string; message: string }
> = {
  default: {
    icon: <Inbox size={48} />,
    title: '데이터가 없습니다',
    message: '표시할 항목이 없습니다.',
  },
  search: {
    icon: <Search size={48} />,
    title: '검색 결과가 없습니다',
    message: '다른 검색어로 다시 시도해 보세요.',
  },
  error: {
    icon: <FileX size={48} />,
    title: '로드에 실패했습니다',
    message: '데이터를 불러오는 중 오류가 발생했습니다.',
  },
  folder: {
    icon: <FolderOpen size={48} />,
    title: '폴더가 비어있습니다',
    message: '이 폴더에는 항목이 없습니다.',
  },
};

export function EmptyState({
  variant = 'default',
  icon,
  title,
  message,
  action,
  className = '',
}: EmptyStateProps) {
  const config = variantConfig[variant];

  return (
    <div
      role="status"
      className={`
        flex flex-col items-center justify-center
        py-12 px-6 text-center
        ${className}
      `}
    >
      <div
        className="
          w-20 h-20 mb-4
          flex items-center justify-center
          rounded-full
          bg-[var(--panel-2)]
          text-[var(--text-tertiary)]
        "
      >
        {icon || config.icon}
      </div>

      <h3 className="text-lg font-semibold text-[var(--text)] mb-2">{title || config.title}</h3>

      <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-sm">
        {message || config.message}
      </p>

      {action && (
        <Button variant="secondary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
