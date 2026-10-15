// import { forwardRef } from 'react';

// export const Input = forwardRef(function Input(
//   { label, error, hint, className = '', id, required, ...rest },
//   ref
// ) {
//   const inputId = id || rest.name;
//   return (
//     <div className={className}>
//       {label && (
//         <label htmlFor={inputId} className="label-base">
//           {label}
//           {required && <span className="text-red-500 ml-0.5">*</span>}
//         </label>
//       )}
//       <input
//         ref={ref}
//         id={inputId}
//         className={`input-base ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
//         {...rest}
//       />
//       {error ? (
//         <p className="error-text">{error}</p>
//       ) : hint ? (
//         <p className="helper-text">{hint}</p>
//       ) : null}
//     </div>
//   );
// });

// export default Input;

import { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  { label, error, hint, className = '', id, required, ...rest },
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
      <input
        ref={ref}
        id={inputId}
        className={`input-base ${
          error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''
        }`}
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

export default Input;