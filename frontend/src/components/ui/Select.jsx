// import { forwardRef } from 'react';

// export const Select = forwardRef(function Select(
//   { label, error, hint, className = '', id, required, options = [], children, ...rest },
//   ref
// ) {
//   const selectId = id || rest.name;
//   return (
//     <div className={className}>
//       {label && (
//         <label htmlFor={selectId} className="label-base">
//           {label}
//           {required && <span className="text-red-500 ml-0.5">*</span>}
//         </label>
//       )}
//       <select
//         ref={ref}
//         id={selectId}
//         className={`input-base ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
//         {...rest}
//       >
//         {children}
//         {options.map((opt) => (
//           <option key={opt.value} value={opt.value}>
//             {opt.label}
//           </option>
//         ))}
//       </select>
//       {error ? (
//         <p className="error-text">{error}</p>
//       ) : hint ? (
//         <p className="helper-text">{hint}</p>
//       ) : null}
//     </div>
//   );
// });

// export default Select;


import { forwardRef } from 'react';

export const Select = forwardRef(function Select(
  { label, error, hint, className = '', id, required, options = [], children, ...rest },
  ref
) {
  const selectId = id || rest.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="label-base">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={`input-base appearance-none pr-9 ${
            error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''
          }`}
          {...rest}
        >
          {children}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      {error ? (
        <p className="error-text">{error}</p>
      ) : hint ? (
        <p className="helper-text">{hint}</p>
      ) : null}
    </div>
  );
});

export default Select;