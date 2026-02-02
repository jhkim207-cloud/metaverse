import { useEffect, useState, ReactNode } from 'react';
import { Search } from 'lucide-react';
import { createPortal } from 'react-dom';

interface CommandAction {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string[]; // e.g. ['Ctrl', 'H']
  onClick: () => void;
}

interface CommandGroup {
  heading: string;
  actions: CommandAction[];
}

interface CommandMenuProps {
  groups: CommandGroup[];
  isOpen?: boolean; // Controlled mode
  onClose?: () => void;
}

export function CommandMenu({ groups, isOpen: controlledOpen, onClose }: CommandMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Toggle handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on Ctrl+K or Cmd+K
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Close on Escape
      if (e.key === 'Escape') {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Sync controlled state
  useEffect(() => {
    if (controlledOpen !== undefined) {
      setIsOpen(controlledOpen);
    }
  }, [controlledOpen]);

  // Filter actions based on query
  const filteredGroups = groups
    .map((group) => ({
      ...group,
      actions: group.actions.filter((action) =>
        action.label.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((group) => group.actions.length > 0);

  const flatActions = filteredGroups.flatMap((g) => g.actions);

  // Keyboard navigation within menu
  useEffect(() => {
    const handleNavigation = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % flatActions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatActions.length) % flatActions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const action = flatActions[selectedIndex];
        if (action) {
          action.onClick();
          setIsOpen(false);
          onClose?.();
        }
      }
    };

    window.addEventListener('keydown', handleNavigation);
    return () => window.removeEventListener('keydown', handleNavigation);
  }, [isOpen, flatActions, selectedIndex, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => {
          setIsOpen(false);
          onClose?.();
        }}
      />

      {/* Menu Panel */}
      <div className="relative w-full max-w-lg bg-[var(--panel)] backdrop-blur-xl border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex items-center px-4 py-3 border-b border-[var(--border)]">
          <Search className="w-5 h-5 text-[var(--text-tertiary)] mr-3" />
          <input
            className="flex-1 bg-transparent border-none outline-none text-[var(--text)] placeholder-[var(--text-tertiary)] text-base"
            placeholder="Type a command or search..."
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <button
            onClick={() => {
              setIsOpen(false);
              onClose?.();
            }}
            className="p-1 hover:bg-[var(--hover-bg)] rounded text-[var(--text-secondary)]"
          >
            <span className="text-xs px-1.5 py-0.5 border border-[var(--border)] rounded bg-[var(--panel-2)]">
              ESC
            </span>
          </button>
        </div>

        <div className="max-h-[300px] overflow-y-auto py-2">
          {filteredGroups.length === 0 ? (
            <div className="px-4 py-8 text-center text-[var(--text-secondary)] text-sm">
              No results found.
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.heading} className="mb-2">
                <div className="px-4 py-1.5 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                  {group.heading}
                </div>
                {group.actions.map((action) => {
                  const isSelected = action.id === flatActions[selectedIndex]?.id;
                  return (
                    <div
                      key={action.id}
                      className={`
                        mx-2 px-3 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors
                        ${isSelected ? 'bg-[var(--accent)] text-[var(--on-accent)]' : 'text-[var(--text)] hover:bg-[var(--hover-bg)]'}
                      `}
                      onClick={() => {
                        action.onClick();
                        setIsOpen(false);
                        onClose?.();
                      }}
                      onMouseEnter={() => {
                        // Find index in flat list
                        const idx = flatActions.findIndex((a) => a.id === action.id);
                        if (idx !== -1) setSelectedIndex(idx);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {action.icon && (
                          <span
                            className={isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}
                          >
                            {action.icon}
                          </span>
                        )}
                        <span className="text-sm font-medium">{action.label}</span>
                      </div>
                      {action.shortcut && (
                        <div className="flex items-center gap-1">
                          {action.shortcut.map((key) => (
                            <kbd
                              key={key}
                              className={`
                              text-[10px] px-1.5 py-0.5 rounded border 
                              ${isSelected ? 'bg-white/20 border-white/20 text-white' : 'bg-[var(--panel-2)] border-[var(--border)] text-[var(--text-secondary)]'}
                            `}
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--panel-2)]/50 text-[10px] text-[var(--text-tertiary)] flex justify-between">
          <span>
            Navigate with <kbd className="font-sans">↑</kbd> <kbd className="font-sans">↓</kbd>
          </span>
          <span>
            Select with <kbd className="font-sans">↵</kbd>
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
