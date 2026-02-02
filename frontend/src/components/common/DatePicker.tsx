import { forwardRef } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

// 한글 로케일 등록
registerLocale('ko', ko);

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  isClearable?: boolean;
  showMonthDropdown?: boolean;
  showYearDropdown?: boolean;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      selected,
      onChange,
      dateFormat = 'yyyy-MM-dd',
      placeholder = '날짜 선택',
      disabled = false,
      minDate,
      maxDate,
      isClearable = true,
      showMonthDropdown = true,
      showYearDropdown = true,
    },
    ref
  ) => {
    return (
      <ReactDatePicker
        ref={ref as React.Ref<ReactDatePicker>}
        selected={selected}
        onChange={onChange}
        dateFormat={dateFormat}
        locale="ko"
        placeholderText={placeholder}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        isClearable={isClearable}
        showMonthDropdown={showMonthDropdown}
        showYearDropdown={showYearDropdown}
        dropdownMode="select"
        className="custom-datepicker-input"
        calendarClassName="custom-datepicker-calendar"
        popperClassName="custom-datepicker-popper"
        todayButton="오늘"
      />
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
