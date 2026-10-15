import { forwardRef } from 'react';

export const Textarea = forwardRef(function Textarea(
  { label, error, hint, className = '', id, required, rows = 4, ...rest },
  ref
) {
  const inputId = id || rest.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="label-base">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={`input-base ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
        {...rest}
      />
      {error ? (
        <p className="error-text">{error}</p>
      ) : hint ? (
        <p className="helper-text">{hint}</p>
      ) : null}
    </div>
  );
});

export default Textarea;