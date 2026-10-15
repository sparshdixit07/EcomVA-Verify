// import { Link } from 'react-router-dom';

// const base =
//   'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';

// const sizes = {
//   sm: 'px-3 py-1.5 text-xs',
//   md: 'px-4 py-2 text-sm',
//   lg: 'px-5 py-2.5 text-base'
// };

// const variants = {
//   primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
//   secondary: 'bg-white text-ink-800 border border-ink-200 hover:bg-ink-50',
//   ghost: 'bg-transparent text-ink-700 hover:bg-ink-100',
//   danger: 'bg-red-600 text-white hover:bg-red-700',
//   success: 'bg-emerald-600 text-white hover:bg-emerald-700',
//   outline: 'border border-brand-500 text-brand-600 hover:bg-brand-50'
// };

// export function Button({
//   as,
//   to,
//   href,
//   type = 'button',
//   variant = 'primary',
//   size = 'md',
//   className = '',
//   loading = false,
//   disabled = false,
//   children,
//   ...rest
// }) {
//   const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

//   if (to) {
//     return (
//       <Link to={to} className={cls} {...rest}>
//         {children}
//       </Link>
//     );
//   }

//   if (href) {
//     return (
//       <a href={href} className={cls} {...rest}>
//         {children}
//       </a>
//     );
//   }

//   return (
//     <button
//       type={type}
//       className={cls}
//       disabled={disabled || loading}
//       {...rest}
//     >
//       {loading && (
//         <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white/60 border-t-transparent animate-spin" />
//       )}
//       {children}
//     </button>
//   );
// }

// export default Button;

import { Link } from 'react-router-dom';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 ease-smooth disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none select-none';

const sizes = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-[15px]'
};

const variants = {
  primary:
    'btn-gradient text-white shadow-glow hover:shadow-[0_16px_40px_-12px_rgba(99,102,241,0.55)] hover:-translate-y-0.5',
  secondary:
    'bg-white text-ink-800 border border-ink-200 shadow-soft hover:bg-ink-50 hover:border-ink-300 hover:-translate-y-0.5',
  ghost:
    'bg-transparent text-ink-700 hover:bg-ink-100/70 hover:text-ink-900',
  danger:
    'bg-red-600 text-white shadow-[0_8px_24px_-8px_rgba(220,38,38,0.5)] hover:bg-red-700 hover:-translate-y-0.5',
  success:
    'bg-emerald-600 text-white shadow-[0_8px_24px_-8px_rgba(5,150,105,0.5)] hover:bg-emerald-700 hover:-translate-y-0.5',
  outline:
    'border border-brand-500 text-brand-700 bg-white hover:bg-brand-50 hover:-translate-y-0.5'
};

export function Button({
  as,
  to,
  href,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  children,
  ...rest
}) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={cls}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
      )}
      {children}
    </button>
  );
}

export default Button;