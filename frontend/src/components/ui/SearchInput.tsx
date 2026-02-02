/**
 * SearchInput 컴포넌트 - 검색 입력 필드
 */

import { useId, KeyboardEvent } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onSearch?: (value: string) => void;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = '검색...',
  disabled = false,
  onSearch,
  className = '',
}: SearchInputProps) {
  const id = useId();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    onChange('');
    onSearch?.('');
  };

  return (
    <div className={`relative ${className}`}>
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={placeholder}
        className={`
          input w-full pl-10 pr-10
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      />
      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="검색어 지우기"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-[var(--hover-bg)] text-[var(--text-secondary)]"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchInput;
