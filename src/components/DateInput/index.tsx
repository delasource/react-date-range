import classnames from 'classnames';
import { FormatOptions, ParseOptions, format, isValid, parse } from 'date-fns';
import React, {memo, ChangeEvent, FocusEvent, KeyboardEvent } from 'react';

type DateInputProps = {
  value: Date,
  placeholder: string,
  disabled?: boolean,
  readOnly?: boolean,
  dateOptions?: ParseOptions,
  dateDisplayFormat: string,
  ariaLabel?: string,
  className?: string,
  onFocus: (event: FocusEvent<HTMLInputElement>) => void,
  onChange: (date: Date) => void
};

export default memo(function DateInput({
  value,
  placeholder,
  disabled,
  readOnly,
  dateOptions,
  dateDisplayFormat,
  ariaLabel,
  className,
  onFocus,
  onChange
}: DateInputProps) {

  const [state, setState] = React.useState({invalid: false, changed: false, value: formatDate(value, dateDisplayFormat, dateOptions as FormatOptions)});

  React.useEffect(() => {
    setState(s => ({...s, value: formatDate(value, dateDisplayFormat, dateOptions as FormatOptions)}));
  }, [value, dateDisplayFormat, dateOptions]);

  const update = (value: string) => {
    const { invalid, changed } = state;

    if (invalid || !changed || !value) {
      return;
    }


    const parsed = parse(value, dateDisplayFormat, new Date(), dateOptions);

    if (isValid(parsed)) {
      setState({...state, changed: false});
      onChange?.(parsed);
    } else {
      setState({...state, invalid: true});
    }

  }

  const onChangeInternal = (event: ChangeEvent<HTMLInputElement>) => {
    setState({value: event.target.value, changed: true, invalid: false});
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      update(state.value);
    }
  }

  const onBlur = () => {
    update(state.value);
  }

  return (
    <span className={classnames('rdrDateInput', className)}>
      <input
          readOnly={readOnly}
          disabled={disabled}
          value={state.value}
          placeholder={placeholder}
          aria-label={ariaLabel}
          onKeyDown={onKeyDown}
          onChange={onChangeInternal}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        {state.invalid ? <span className="rdrWarning">&#9888;</span> : null}
    </span>
  )
});

function formatDate(value: Date, dateDisplayFormat: string, dateOptions?: FormatOptions) {
  if (value && isValid(value)) {
    return format(value, dateDisplayFormat, dateOptions);
  }

  return '';
}