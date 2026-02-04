/**
 * EditableGrid - Excel-like 대량 데이터 입력을 위한 편집 가능 그리드
 *
 * 기능:
 * - 인라인 셀 편집
 * - 키보드 네비게이션 (Tab, Enter, Arrow Keys)
 * - Excel 붙여넣기 지원 (Ctrl+V)
 * - 셀 유효성 검증
 * - 행 추가/삭제
 * - 행 번호 표시
 * - 컬럼 정렬 (오름차순/내림차순)
 * - 컬럼 너비 조정 (드래그)
 * - 고정 컬럼 (pinned left/right)
 * - 행 선택 체크박스
 * - Delete/Backspace로 셀 값 삭제
 * - 컨텍스트 메뉴 (우클릭)
 */

import React, { useState, useCallback, useRef, useEffect, KeyboardEvent, ClipboardEvent, MouseEvent, useMemo } from 'react';
import { Plus, Trash2, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';

// 타입 정의
export interface EditableColumn<T> {
  key: keyof T & string;
  header: string;
  width?: number;
  minWidth?: number;
  editable?: boolean;
  sortable?: boolean;
  pinned?: 'left' | 'right'; // 고정 컬럼
  hidden?: boolean; // 숨김 여부
  type?: 'text' | 'number' | 'select';
  options?: { value: string; label: string }[]; // select 타입용
  render?: (value: unknown, row: T, rowIndex: number) => React.ReactNode;
}

export interface CellPosition {
  rowIndex: number;
  columnKey: string;
}

export interface CellRange {
  start: CellPosition;
  end: CellPosition;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  columnKey: string | null;
  direction: SortDirection;
}

// 컨텍스트 메뉴 아이템
export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  divider?: boolean;
}

export interface EditableGridProps<T> {
  columns: EditableColumn<T>[];
  data: T[];
  onChange: (rowIndex: number, key: keyof T, value: unknown) => void;
  onPaste?: (pastedData: string[][], startCell: CellPosition) => void;
  onValidate?: (row: T, columnKey: string) => ValidationResult;
  keyExtractor: (row: T, index: number) => string | number;
  rowHeight?: number;
  maxRows?: number;
  showRowNumbers?: boolean;
  showRowSelection?: boolean; // 행 선택 체크박스
  allowAddRow?: boolean;
  allowDeleteRow?: boolean;
  allowResize?: boolean;
  onAddRow?: () => void;
  onDeleteRow?: (rowIndex: number) => void;
  onSort?: (columnKey: string, direction: SortDirection) => void;
  onRowSelect?: (selectedRows: T[]) => void; // 행 선택 콜백
  contextMenuItems?: (row: T, rowIndex: number) => ContextMenuItem[]; // 컨텍스트 메뉴
  className?: string;
}

interface EditingCell {
  rowIndex: number;
  columnKey: string;
  value: string;
  selectAll?: boolean; // true면 전체 선택, false면 커서를 끝으로
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  rowIndex: number;
}

export function EditableGrid<T extends Record<string, unknown>>({
  columns: initialColumns,
  data,
  onChange,
  onPaste,
  onValidate,
  keyExtractor,
  rowHeight = 42,
  showRowNumbers = true,
  showRowSelection = false,
  allowAddRow = true,
  allowDeleteRow = true,
  allowResize = true,
  onAddRow,
  onDeleteRow,
  onSort,
  onRowSelect,
  contextMenuItems,
  className = '',
}: EditableGridProps<T>) {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [selectionRange, setSelectionRange] = useState<CellRange | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [sortState, setSortState] = useState<SortState>({ columnKey: null, direction: null });
  const [columnWidths, setColumnWidths] = useState<Map<string, number>>(new Map());
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState<number>(0);
  const [resizeStartWidth, setResizeStartWidth] = useState<number>(0);

  // 새로운 기능 상태
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // 컬럼 정의 (너비 상태 반영)
  const columns = useMemo(() => {
    return initialColumns
      .filter((col) => !col.hidden)
      .map((col) => ({
        ...col,
        width: columnWidths.get(col.key) || col.width || 120,
      }));
  }, [initialColumns, columnWidths]);

  // 왼쪽/오른쪽 고정 컬럼 분리 (향후 고정 컬럼 렌더링에 사용)
  const _pinnedColumnsInfo = useMemo(() => {
    type ColumnWithWidth = typeof columns[number];
    const left: ColumnWithWidth[] = [];
    const normal: ColumnWithWidth[] = [];
    const right: ColumnWithWidth[] = [];

    columns.forEach((col) => {
      if (col.pinned === 'left') left.push(col);
      else if (col.pinned === 'right') right.push(col);
      else normal.push(col);
    });

    return { pinnedLeftColumns: left, normalColumns: normal, pinnedRightColumns: right };
  }, [columns]);
  // 현재는 미사용, 향후 고정 컬럼 UI 구현 시 활용
  void _pinnedColumnsInfo;

  // 정렬된 데이터
  const sortedData = useMemo(() => {
    const result = data;

    if (!sortState.columnKey || !sortState.direction) return result;

    const column = columns.find((c) => c.key === sortState.columnKey);
    if (!column) return result;

    return [...result].sort((a, b) => {
      const aVal = a[sortState.columnKey as keyof T];
      const bVal = b[sortState.columnKey as keyof T];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortState.direction === 'asc' ? 1 : -1;
      if (bVal == null) return sortState.direction === 'asc' ? -1 : 1;

      let comparison = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal), 'ko');
      }

      return sortState.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortState, columns]);

  // 에러 키 생성
  const getErrorKey = (rowIndex: number, columnKey: string) => `${rowIndex}-${columnKey}`;

  // 셀 유효성 검사
  const validateCell = useCallback(
    (rowIndex: number, columnKey: string): boolean => {
      if (!onValidate || !data[rowIndex]) return true;

      const result = onValidate(data[rowIndex], columnKey);
      const errorKey = getErrorKey(rowIndex, columnKey);

      if (!result.valid) {
        setErrors((prev: Map<string, string>) => new Map(prev).set(errorKey, result.message || '유효하지 않은 값'));
        return false;
      } else {
        setErrors((prev: Map<string, string>) => {
          const next = new Map(prev);
          next.delete(errorKey);
          return next;
        });
        return true;
      }
    },
    [onValidate, data]
  );

  // 편집 시작
  const startEditing = useCallback(
    (rowIndex: number, columnKey: string, initialValue?: string) => {
      const column = columns.find((c) => c.key === columnKey);
      if (!column || column.editable === false) return;

      const row = sortedData[rowIndex];
      if (!row) return;

      // initialValue가 제공되면 그 값으로 (문자 입력으로 시작), 아니면 기존 셀 값으로 초기화
      const isTypingStart = initialValue !== undefined;
      const value = isTypingStart
        ? initialValue
        : (row[columnKey as keyof T] != null ? String(row[columnKey as keyof T]) : '');

      setEditingCell({
        rowIndex,
        columnKey,
        value,
        selectAll: !isTypingStart, // 문자 입력으로 시작하면 전체 선택 안 함
      });
    },
    [columns, sortedData]
  );

  // 편집 완료
  const finishEditing = useCallback(
    (save: boolean = true) => {
      if (!editingCell) return;

      if (save) {
        const column = columns.find((c) => c.key === editingCell.columnKey);
        let value: unknown = editingCell.value;

        // 타입에 따른 값 변환
        if (column?.type === 'number') {
          value = editingCell.value === '' ? null : parseFloat(editingCell.value);
          if (isNaN(value as number)) value = null;
        }

        // 원본 데이터 인덱스 찾기
        const originalRow = sortedData[editingCell.rowIndex];
        const originalIndex = data.findIndex((row) => keyExtractor(row, 0) === keyExtractor(originalRow, 0));
        if (originalIndex !== -1) {
          onChange(originalIndex, editingCell.columnKey as keyof T, value);
          validateCell(originalIndex, editingCell.columnKey);
        }
      }

      setEditingCell(null);
    },
    [editingCell, columns, onChange, validateCell, sortedData, data, keyExtractor]
  );

  // 다음 셀로 이동 (방향키용 - 모든 컬럼 대상)
  const moveToNextCell = useCallback(
    (direction: 'next' | 'prev' | 'up' | 'down') => {
      if (!selectedCell) return;

      const { rowIndex, columnKey } = selectedCell;
      // 모든 컬럼에서 현재 위치 찾기
      const colIndex = columns.findIndex((c) => c.key === columnKey);

      let newRowIndex = rowIndex;
      let newColIndex = colIndex;

      switch (direction) {
        case 'next':
          if (colIndex < columns.length - 1) {
            newColIndex = colIndex + 1;
          } else if (rowIndex < sortedData.length - 1) {
            newRowIndex = rowIndex + 1;
            newColIndex = 0;
          }
          break;
        case 'prev':
          if (colIndex > 0) {
            newColIndex = colIndex - 1;
          } else if (rowIndex > 0) {
            newRowIndex = rowIndex - 1;
            newColIndex = columns.length - 1;
          }
          break;
        case 'up':
          if (rowIndex > 0) newRowIndex = rowIndex - 1;
          break;
        case 'down':
          if (rowIndex < sortedData.length - 1) newRowIndex = rowIndex + 1;
          break;
      }

      if (newRowIndex !== rowIndex || newColIndex !== colIndex) {
        const newColumnKey = columns[newColIndex]?.key;
        if (newColumnKey) {
          setSelectedCell({ rowIndex: newRowIndex, columnKey: newColumnKey });
        }
      }
    },
    [selectedCell, columns, sortedData.length]
  );

  // 셀이 선택 범위 내에 있는지 확인
  const isCellInRange = (rowIndex: number, columnKey: string): boolean => {
    if (!selectionRange) return false;

    const { start, end } = selectionRange;
    const startColIndex = columns.findIndex((c) => c.key === start.columnKey);
    const endColIndex = columns.findIndex((c) => c.key === end.columnKey);
    const cellColIndex = columns.findIndex((c) => c.key === columnKey);

    const minRow = Math.min(start.rowIndex, end.rowIndex);
    const maxRow = Math.max(start.rowIndex, end.rowIndex);
    const minCol = Math.min(startColIndex, endColIndex);
    const maxCol = Math.max(startColIndex, endColIndex);

    const inRange = rowIndex >= minRow && rowIndex <= maxRow && cellColIndex >= minCol && cellColIndex <= maxCol;
    return inRange;
  };

  // 셀의 범위 테두리 위치 확인 (Excel 스타일 외곽 테두리용)
  const getCellBorderPosition = (rowIndex: number, columnKey: string): { top: boolean; bottom: boolean; left: boolean; right: boolean } => {
    if (!selectionRange) return { top: false, bottom: false, left: false, right: false };

    const { start, end } = selectionRange;
    const startColIndex = columns.findIndex((c) => c.key === start.columnKey);
    const endColIndex = columns.findIndex((c) => c.key === end.columnKey);
    const cellColIndex = columns.findIndex((c) => c.key === columnKey);

    const minRow = Math.min(start.rowIndex, end.rowIndex);
    const maxRow = Math.max(start.rowIndex, end.rowIndex);
    const minCol = Math.min(startColIndex, endColIndex);
    const maxCol = Math.max(startColIndex, endColIndex);

    // 범위 내에 있는지 먼저 확인
    const inRange = rowIndex >= minRow && rowIndex <= maxRow && cellColIndex >= minCol && cellColIndex <= maxCol;
    if (!inRange) return { top: false, bottom: false, left: false, right: false };

    return {
      top: rowIndex === minRow,
      bottom: rowIndex === maxRow,
      left: cellColIndex === minCol,
      right: cellColIndex === maxCol,
    };
  };

  // 선택 범위 데이터를 클립보드 텍스트로 변환
  const getSelectionAsText = useCallback((): string => {
    if (!selectionRange) {
      // 단일 셀 선택
      if (selectedCell) {
        const row = sortedData[selectedCell.rowIndex];
        if (row) {
          const value = row[selectedCell.columnKey as keyof T];
          return value != null ? String(value) : '';
        }
      }
      return '';
    }

    const { start, end } = selectionRange;
    const startColIndex = columns.findIndex((c) => c.key === start.columnKey);
    const endColIndex = columns.findIndex((c) => c.key === end.columnKey);

    const minRow = Math.min(start.rowIndex, end.rowIndex);
    const maxRow = Math.max(start.rowIndex, end.rowIndex);
    const minCol = Math.min(startColIndex, endColIndex);
    const maxCol = Math.max(startColIndex, endColIndex);

    const lines: string[] = [];
    for (let rowIdx = minRow; rowIdx <= maxRow; rowIdx++) {
      const row = sortedData[rowIdx];
      if (!row) continue;

      const cells: string[] = [];
      for (let colIdx = minCol; colIdx <= maxCol; colIdx++) {
        const column = columns[colIdx];
        if (!column) continue;

        const value = row[column.key as keyof T];
        cells.push(value != null ? String(value) : '');
      }
      lines.push(cells.join('\t'));
    }

    return lines.join('\n');
  }, [selectionRange, selectedCell, sortedData, columns]);

  // 복사 핸들러
  const handleCopy = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      if (editingCell) return; // 편집 중에는 기본 복사 동작

      const text = getSelectionAsText();
      if (text) {
        e.preventDefault();
        e.clipboardData.setData('text/plain', text);
      }
    },
    [editingCell, getSelectionAsText]
  );

  // Shift + 방향키로 범위 선택 확장
  const extendSelection = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (!selectedCell) return;

      const currentEnd = selectionRange?.end || selectedCell;
      const colIndex = columns.findIndex((c) => c.key === currentEnd.columnKey);

      let newRowIndex = currentEnd.rowIndex;
      let newColIndex = colIndex;

      switch (direction) {
        case 'up':
          if (newRowIndex > 0) newRowIndex--;
          break;
        case 'down':
          if (newRowIndex < sortedData.length - 1) newRowIndex++;
          break;
        case 'left':
          if (newColIndex > 0) newColIndex--;
          break;
        case 'right':
          if (newColIndex < columns.length - 1) newColIndex++;
          break;
      }

      const newColumnKey = columns[newColIndex]?.key;
      if (newColumnKey) {
        setSelectionRange({
          start: selectionRange?.start || selectedCell,
          end: { rowIndex: newRowIndex, columnKey: newColumnKey },
        });
      }
    },
    [selectedCell, selectionRange, columns, sortedData.length]
  );

  // 키보드 이벤트 핸들러
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      // Ctrl+C 복사 (ClipboardEvent에서 처리하지만 추가 지원)
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !editingCell) {
        // onCopy 이벤트로 처리됨
        return;
      }

      // Ctrl+A 전체 선택
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && !editingCell) {
        e.preventDefault();
        e.stopPropagation();
        if (sortedData.length > 0 && columns.length > 0) {
          setSelectedCell({ rowIndex: 0, columnKey: columns[0].key });
          setSelectionRange({
            start: { rowIndex: 0, columnKey: columns[0].key },
            end: { rowIndex: sortedData.length - 1, columnKey: columns[columns.length - 1].key },
          });
        }
        return;
      }

      if (editingCell) {
        // 편집 모드
        switch (e.key) {
          case 'Escape':
            finishEditing(false);
            break;
          case 'Enter':
            finishEditing(true);
            if (e.shiftKey) {
              moveToNextCell('up');
            } else {
              moveToNextCell('down');
            }
            break;
          case 'Tab':
            e.preventDefault();
            finishEditing(true);
            moveToNextCell(e.shiftKey ? 'prev' : 'next');
            break;
        }
      } else if (selectedCell) {
        // 선택 모드 - 방향키 및 Shift+방향키 처리
        const isArrowKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key);

        if (isArrowKey) {
          // 방향키는 항상 기본 동작 방지 (브라우저 스크롤, 텍스트 선택 방지)
          e.preventDefault();
          e.stopPropagation();
        }

        switch (e.key) {
          case 'F2':
          case 'Enter':
            startEditing(selectedCell.rowIndex, selectedCell.columnKey);
            break;
          case 'Tab':
            e.preventDefault();
            setSelectionRange(null);
            moveToNextCell(e.shiftKey ? 'prev' : 'next');
            break;
          case 'ArrowUp':
            if (e.shiftKey) {
              extendSelection('up');
            } else {
              setSelectionRange(null);
              moveToNextCell('up');
            }
            break;
          case 'ArrowDown':
            if (e.shiftKey) {
              extendSelection('down');
            } else {
              setSelectionRange(null);
              moveToNextCell('down');
            }
            break;
          case 'ArrowLeft':
            if (e.shiftKey) {
              extendSelection('left');
            } else {
              setSelectionRange(null);
              moveToNextCell('prev');
            }
            break;
          case 'ArrowRight':
            if (e.shiftKey) {
              extendSelection('right');
            } else {
              setSelectionRange(null);
              moveToNextCell('next');
            }
            break;
          case 'Delete':
          case 'Backspace':
            e.preventDefault();
            // 선택 범위가 있으면 범위 내 셀 값 삭제
            if (selectionRange) {
              const { start, end } = selectionRange;
              const startColIndex = columns.findIndex((c) => c.key === start.columnKey);
              const endColIndex = columns.findIndex((c) => c.key === end.columnKey);
              const minRow = Math.min(start.rowIndex, end.rowIndex);
              const maxRow = Math.max(start.rowIndex, end.rowIndex);
              const minCol = Math.min(startColIndex, endColIndex);
              const maxCol = Math.max(startColIndex, endColIndex);

              for (let rowIdx = minRow; rowIdx <= maxRow; rowIdx++) {
                const originalRow = sortedData[rowIdx];
                const originalIndex = data.findIndex((row: T) => keyExtractor(row, 0) === keyExtractor(originalRow, 0));
                if (originalIndex === -1) continue;

                for (let colIdx = minCol; colIdx <= maxCol; colIdx++) {
                  const column = columns[colIdx];
                  if (!column || column.editable === false) continue;

                  const clearValue = column.type === 'number' ? null : '';
                  onChange(originalIndex, column.key as keyof T, clearValue);
                }
              }
            } else {
              // 단일 셀 값 삭제
              const column = columns.find((c) => c.key === selectedCell.columnKey);
              if (column && column.editable !== false) {
                const originalRow = sortedData[selectedCell.rowIndex];
                const originalIndex = data.findIndex((row: T) => keyExtractor(row, 0) === keyExtractor(originalRow, 0));
                if (originalIndex !== -1) {
                  const clearValue = column.type === 'number' ? null : '';
                  onChange(originalIndex, column.key as keyof T, clearValue);
                }
              }
            }
            break;
          case 'Escape':
            setSelectionRange(null);
            break;
          default:
            // 문자 입력 시 편집 모드 진입 (입력한 문자로 시작)
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
              startEditing(selectedCell.rowIndex, selectedCell.columnKey, e.key);
            }
            break;
        }
      }
    },
    [
      editingCell,
      selectedCell,
      finishEditing,
      moveToNextCell,
      startEditing,
      extendSelection,
      allowDeleteRow,
      onDeleteRow,
      sortedData,
      data,
      columns,
      keyExtractor,
    ]
  );

  // 붙여넣기 핸들러
  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLDivElement>) => {
      if (!selectedCell) return;

      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');

      // 탭과 줄바꿈으로 2D 배열 파싱
      const rows = text.split('\n').filter((row) => row.trim());
      const pastedData = rows.map((row) => row.split('\t'));

      // 커스텀 onPaste 핸들러가 있으면 사용
      if (onPaste) {
        onPaste(pastedData, selectedCell);
        return;
      }

      // 기본 붙여넣기: 선택된 셀부터 데이터 채우기
      const { rowIndex: startRow, columnKey: startColKey } = selectedCell;
      const startColIndex = columns.findIndex((c) => c.key === startColKey);

      if (startColIndex === -1) return;

      pastedData.forEach((rowData: string[], rowOffset: number) => {
        const targetRowIndex = startRow + rowOffset;
        if (targetRowIndex >= sortedData.length) return;

        // 원본 인덱스 찾기
        const originalRow = sortedData[targetRowIndex];
        const originalIndex = data.findIndex((row) => keyExtractor(row, 0) === keyExtractor(originalRow, 0));
        if (originalIndex === -1) return;

        rowData.forEach((cellValue: string, colOffset: number) => {
          const targetColIndex = startColIndex + colOffset;
          if (targetColIndex >= columns.length) return;

          const column = columns[targetColIndex];
          if (!column || column.editable === false) return;

          let value: unknown = cellValue.trim();

          // 타입에 따른 값 변환
          if (column.type === 'number') {
            const num = parseFloat(value as string);
            value = isNaN(num) ? null : num;
          }

          onChange(originalIndex, column.key as keyof T, value);
        });
      });
    },
    [onPaste, selectedCell, columns, sortedData, data, keyExtractor, onChange]
  );

  // 정렬 핸들러
  const handleSort = useCallback(
    (columnKey: string) => {
      const column = columns.find((c) => c.key === columnKey);
      if (!column?.sortable) return;

      let newDirection: SortDirection = 'asc';
      if (sortState.columnKey === columnKey) {
        if (sortState.direction === 'asc') newDirection = 'desc';
        else if (sortState.direction === 'desc') newDirection = null;
      }

      setSortState({ columnKey: newDirection ? columnKey : null, direction: newDirection });
      onSort?.(columnKey, newDirection);
    },
    [columns, sortState, onSort]
  );

  // 컬럼 리사이즈 시작
  const handleResizeStart = useCallback(
    (e: MouseEvent, columnKey: string) => {
      if (!allowResize) return;

      e.preventDefault();
      e.stopPropagation();

      const column = columns.find((c) => c.key === columnKey);
      if (!column) return;

      setResizingColumn(columnKey);
      setResizeStartX(e.clientX);
      setResizeStartWidth(column.width || 120);
    },
    [allowResize, columns]
  );

  // 컬럼 리사이즈 중
  useEffect(() => {
    if (!resizingColumn) return;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const delta = e.clientX - resizeStartX;
      const column = initialColumns.find((c) => c.key === resizingColumn);
      const minWidth = column?.minWidth || 60;
      const newWidth = Math.max(minWidth, resizeStartWidth + delta);

      setColumnWidths((prev) => new Map(prev).set(resizingColumn, newWidth));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumn, resizeStartX, resizeStartWidth, initialColumns]);

  // 편집 인풋 포커스
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      if (editingCell.selectAll) {
        // 더블클릭/Enter/F2로 편집 시작: 전체 선택
        inputRef.current.select();
      } else {
        // 문자 입력으로 편집 시작: 커서를 끝으로
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
      }
    }
  }, [editingCell]);

  // 마우스 드래그 선택 종료
  useEffect(() => {
    if (!isSelecting) return;

    const handleMouseUp = () => {
      setIsSelecting(false);
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSelecting]);

  // 셀 더블클릭 핸들러
  const handleCellDoubleClick = (rowIndex: number, columnKey: string) => {
    startEditing(rowIndex, columnKey);
  };

  // 셀 렌더링
  const renderCell = (row: T, column: EditableColumn<T>, rowIndex: number) => {
    const value = row[column.key];
    const isEditing =
      editingCell?.rowIndex === rowIndex && editingCell?.columnKey === column.key;
    const errorKey = getErrorKey(rowIndex, column.key);
    const error = errors.get(errorKey);

    // 숫자 타입 판별: column.type이 'number'이거나 값이 실제 숫자인 경우
    const isNumber = column.type === 'number' || (typeof value === 'number' && !isNaN(value));
    const textAlign = isNumber ? 'text-right' : 'text-left';

    if (isEditing) {
      return (
        <input
          ref={inputRef}
          type="text"
          inputMode={column.type === 'number' ? 'decimal' : 'text'}
          value={editingCell.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEditingCell((prev: EditingCell | null) => (prev ? { ...prev, value: e.target.value } : null))
          }
          onBlur={() => finishEditing(true)}
          onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          className={`w-full h-full py-1 bg-white dark:bg-gray-800 border-none outline-none text-sm ${textAlign}`}
          style={{ minHeight: rowHeight - 2, fontVariantNumeric: isNumber ? 'tabular-nums' : undefined }}
        />
      );
    }

    if (column.render) {
      return column.render(value, row, rowIndex);
    }

    return (
      <div className={`relative flex items-center w-full h-full py-1 ${isNumber ? 'justify-end' : 'justify-start'}`}>
        <span className={`truncate ${isNumber ? 'tabular-nums' : ''}`}>
          {value != null ? String(value) : ''}
        </span>
        {error && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <AlertCircle size={14} className="text-red-500" title={error} />
          </div>
        )}
      </div>
    );
  };

  // Shift 키 감지를 위한 이벤트 핸들러
  const handleMouseDownCapture = useCallback((e: React.MouseEvent) => {
    // Shift 클릭 시 브라우저 텍스트 선택 방지
    if (e.shiftKey) {
      e.preventDefault();
    }
  }, []);

  // 행 선택 핸들러
  const handleRowSelect = useCallback(
    (rowIndex: number, checked: boolean) => {
      const row = sortedData[rowIndex];
      const rowKey = keyExtractor(row, rowIndex);

      setSelectedRows((prev) => {
        const next = new Set(prev);
        if (checked) {
          next.add(rowKey);
        } else {
          next.delete(rowKey);
        }

        // 콜백 호출
        if (onRowSelect) {
          const selectedData = sortedData.filter((r, i) =>
            next.has(keyExtractor(r, i))
          );
          onRowSelect(selectedData);
        }

        return next;
      });
    },
    [sortedData, keyExtractor, onRowSelect]
  );

  // 전체 선택/해제
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const allKeys = new Set(sortedData.map((row, i) => keyExtractor(row, i)));
        setSelectedRows(allKeys);
        if (onRowSelect) {
          onRowSelect([...sortedData]);
        }
      } else {
        setSelectedRows(new Set());
        if (onRowSelect) {
          onRowSelect([]);
        }
      }
    },
    [sortedData, keyExtractor, onRowSelect]
  );

  // 컨텍스트 메뉴 핸들러
  const handleContextMenu = useCallback(
    (e: React.MouseEvent, rowIndex: number) => {
      if (!contextMenuItems) return;

      e.preventDefault();
      e.stopPropagation();

      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        rowIndex,
      });
    },
    [contextMenuItems]
  );

  // 클릭 외부 영역 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };

    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  // 전체 선택 상태
  const isAllSelected = sortedData.length > 0 && selectedRows.size === sortedData.length;
  const isPartialSelected = selectedRows.size > 0 && selectedRows.size < sortedData.length;

  return (
    <div
      ref={gridRef}
      className={`editable-grid border border-[var(--border)] rounded-lg overflow-hidden select-none ${className}`}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onCopy={handleCopy}
      onMouseDownCapture={handleMouseDownCapture}
      tabIndex={0}
      style={{
        outline: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        background: 'var(--panel)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* 헤더 */}
      <div
        className="flex bg-[var(--panel-2)] border-b border-[var(--border)] sticky top-0 z-10"
        style={{ height: rowHeight }}
      >
        {/* 행 선택 전체 체크박스 */}
        {showRowSelection && (
          <div
            className="flex items-center justify-center border-r border-[var(--border)] bg-[var(--panel-2)]"
            style={{ width: 40, minWidth: 40 }}
          >
            <input
              type="checkbox"
              title="전체 선택"
              checked={isAllSelected}
              ref={(el: HTMLInputElement | null) => {
                if (el) el.indeterminate = isPartialSelected;
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectAll(e.target.checked)}
              className="rounded"
            />
          </div>
        )}
        {showRowNumbers && (
          <div
            className="flex items-center justify-center text-xs text-[var(--text-tertiary)] border-r border-[var(--border)] bg-[var(--panel-2)]"
            style={{ width: 48, minWidth: 48 }}
          >
            #
          </div>
        )}
        {columns.map((column) => (
          <div
            key={column.key}
            className="relative flex items-center border-r border-[var(--border)]"
            style={{ width: column.width, minWidth: column.minWidth || 60 }}
          >
            {/* 헤더 텍스트 영역 (클릭 시 정렬) */}
            <div
              className={`flex-1 flex items-center gap-1 px-3 text-sm font-medium text-[var(--text-secondary)] h-full overflow-hidden ${
                column.sortable ? 'cursor-pointer hover:bg-[var(--hover-bg)]' : ''
              }`}
              onClick={() => column.sortable && handleSort(column.key)}
            >
              <span className="truncate">{column.header}</span>
              {column.sortable && sortState.columnKey === column.key && (
                <span className="shrink-0">
                  {sortState.direction === 'asc' ? (
                    <ArrowUp size={14} className="text-blue-500 dark:text-blue-400" />
                  ) : (
                    <ArrowDown size={14} className="text-blue-500 dark:text-blue-400" />
                  )}
                </span>
              )}
            </div>
            {/* 리사이즈 핸들 */}
            {allowResize && (
              <div
                className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[var(--accent)] transition-colors ${
                  resizingColumn === column.key ? 'bg-[var(--accent)]' : ''
                }`}
                onMouseDown={(e: React.MouseEvent) => handleResizeStart(e, column.key)}
              />
            )}
          </div>
        ))}
        {allowDeleteRow && (
          <div
            className="flex items-center justify-center border-r border-[var(--border)]"
            style={{ width: 40, minWidth: 40 }}
          />
        )}
      </div>

      {/* 본문 */}
      <div className="overflow-auto" style={{ maxHeight: 400 }}>
        {sortedData.map((row: T, rowIndex: number) => {
          const rowKey = keyExtractor(row, rowIndex);
          const isRowSelected = selectedRows.has(rowKey);

          return (
          <div
            key={rowKey}
            className={`flex border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--hover-bg)] ${
              isRowSelected ? 'bg-[var(--accent)]/10' : ''
            }`}
            style={{ height: rowHeight }}
            onContextMenu={(e: React.MouseEvent) => handleContextMenu(e, rowIndex)}
          >
            {/* 행 선택 체크박스 */}
            {showRowSelection && (
              <div
                className="flex items-center justify-center border-r border-[var(--border)] bg-[var(--panel-2)]"
                style={{ width: 40, minWidth: 40 }}
              >
                <input
                  type="checkbox"
                  title={`${rowIndex + 1}행 선택`}
                  checked={isRowSelected}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRowSelect(rowIndex, e.target.checked)}
                  className="rounded"
                />
              </div>
            )}
            {showRowNumbers && (
              <div
                className="flex items-center justify-center text-xs text-[var(--text-tertiary)] border-r border-[var(--border)] bg-[var(--panel-2)]"
                style={{ width: 48, minWidth: 48 }}
              >
                {rowIndex + 1}
              </div>
            )}
            {columns.map((column) => {
              const isSelected =
                selectedCell?.rowIndex === rowIndex && selectedCell?.columnKey === column.key;
              const isInRange = isCellInRange(rowIndex, column.key);
              const isEditable = column.editable !== false;
              const borderPos = getCellBorderPosition(rowIndex, column.key);
              const hasRangeBorder = borderPos.top || borderPos.bottom || borderPos.left || borderPos.right;

              return (
                <div
                  key={column.key}
                  className={`
                    flex items-center text-sm relative px-3
                    ${!hasRangeBorder ? 'border-r border-[var(--border)] last:border-r-0' : ''}
                    ${isSelected && !selectionRange ? 'ring-2 ring-inset ring-blue-500 dark:ring-blue-400' : ''}
                    ${isInRange ? 'bg-blue-100 dark:bg-blue-900/50' : ''}
                    ${isEditable && !isInRange ? 'cursor-text' : ''}
                    ${!isEditable && !isInRange ? 'cursor-default bg-[var(--panel-2)]' : ''}
                  `}
                  style={{
                    width: column.width,
                    minWidth: column.minWidth || 60,
                    // Excel 스타일 범위 테두리
                    borderTop: borderPos.top ? '2px solid #3b82f6' : undefined,
                    borderBottom: borderPos.bottom ? '2px solid #3b82f6' : undefined,
                    borderLeft: borderPos.left ? '2px solid #3b82f6' : undefined,
                    borderRight: borderPos.right ? '2px solid #3b82f6' : (hasRangeBorder ? '1px solid var(--border)' : undefined),
                  }}
                  onMouseDown={(e: React.MouseEvent) => {
                    // 좌클릭(0)만 허용
                    if (e.button !== 0) return;

                    // 현재 편집 중인 셀을 클릭한 경우 아무것도 하지 않음
                    const isCurrentlyEditing =
                      editingCell?.rowIndex === rowIndex && editingCell?.columnKey === column.key;
                    if (isCurrentlyEditing) return;

                    // Shift+클릭 시 브라우저 기본 텍스트 선택 방지
                    if (e.shiftKey) {
                      e.preventDefault();
                    }

                    // 그리드에 포커스 주기 (키보드 이벤트 수신을 위해)
                    // setTimeout으로 이벤트 루프 후에 포커스 (더 안정적)
                    setTimeout(() => {
                      gridRef.current?.focus();
                    }, 0);

                    if (e.shiftKey && selectedCell) {
                      // Shift+클릭으로 범위 선택
                      setSelectionRange({
                        start: selectedCell,
                        end: { rowIndex, columnKey: column.key },
                      });
                    } else {
                      // 새 셀 선택 및 드래그 시작
                      const newCell = { rowIndex, columnKey: column.key };
                      setSelectedCell(newCell);
                      setSelectionRange(null);
                      setIsSelecting(true);
                      setEditingCell(null);
                    }
                  }}
                  onMouseEnter={() => {
                    // 드래그 중 범위 확장
                    if (isSelecting && selectedCell) {
                      setSelectionRange({
                        start: selectedCell,
                        end: { rowIndex, columnKey: column.key },
                      });
                    }
                  }}
                  onDoubleClick={() => handleCellDoubleClick(rowIndex, column.key)}
                >
                  {renderCell(row, column, rowIndex)}
                </div>
              );
            })}
            {allowDeleteRow && (
              <div
                className="flex items-center justify-center"
                style={{ width: 40, minWidth: 40 }}
              >
                <button
                  onClick={() => {
                    const originalRow = sortedData[rowIndex];
                    const originalIndex = data.findIndex((r) => keyExtractor(r, 0) === keyExtractor(originalRow, 0));
                    if (originalIndex !== -1) {
                      onDeleteRow?.(originalIndex);
                    }
                  }}
                  className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  title="행 삭제"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        );
        })}
      </div>

      {/* 컨텍스트 메뉴 */}
      {contextMenu && contextMenuItems && (
        <div
          className="fixed z-50 min-w-[160px] bg-[var(--panel)] border border-[var(--border)] rounded-lg shadow-lg py-1"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {contextMenuItems(sortedData[contextMenu.rowIndex], contextMenu.rowIndex).map((item, idx) => (
            item.divider ? (
              <div key={idx} className="border-t border-[var(--border)] my-1" />
            ) : (
              <button
                key={idx}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick();
                  setContextMenu(null);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left ${
                  item.disabled
                    ? 'text-[var(--text-tertiary)] cursor-not-allowed'
                    : 'text-[var(--text)] hover:bg-[var(--hover-bg)]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            )
          ))}
        </div>
      )}

      {/* 행 추가 버튼 */}
      {allowAddRow && onAddRow && (
        <div
          className="flex items-center border-t border-[var(--border)] bg-[var(--panel)]"
          style={{ height: rowHeight }}
        >
          <button
            onClick={onAddRow}
            className="flex items-center gap-1 px-3 h-full text-sm text-[var(--accent)] hover:bg-[var(--hover-bg)] transition-colors"
          >
            <Plus size={14} />
            <span>행 추가</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default EditableGrid;
