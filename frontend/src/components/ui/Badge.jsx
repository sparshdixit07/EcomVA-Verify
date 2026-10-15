// const tones = {
//   neutral: 'bg-ink-100 text-ink-700',
//   brand: 'bg-brand-50 text-brand-700',
//   success: 'bg-emerald-50 text-emerald-700',
//   warning: 'bg-amber-50 text-amber-700',
//   danger: 'bg-red-50 text-red-700',
//   info: 'bg-sky-50 text-sky-700'
// };

// export function Badge({ tone = 'neutral', children, className = '' }) {
//   return (
//     <span
//       className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tones[tone]} ${className}`}
//     >
//       {children}
//     </span>
//   );
// }

// export function statusTone(status) {
//   const map = {
//     active: 'success',
//     verified: 'success',
//     approved: 'success',
//     accepted: 'success',
//     passed: 'success',
//     completed: 'success',
//     pending: 'warning',
//     in_progress: 'info',
//     submitted: 'info',
//     revision: 'warning',
//     unverified: 'neutral',
//     draft: 'neutral',
//     closed: 'neutral',
//     rejected: 'danger',
//     suspended: 'danger',
//     cancelled: 'danger',
//     failed: 'danger'
//   };
//   return map[status] || 'neutral';
// }

// export default Badge;

const tones = {
  neutral: 'bg-ink-100 text-ink-700 ring-1 ring-ink-200/60',
  brand: 'bg-brand-50 text-brand-700 ring-1 ring-brand-200/60',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60',
  warning: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200/60',
  danger: 'bg-red-50 text-red-700 ring-1 ring-red-200/60',
  info: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200/60'
};

const dots = {
  neutral: 'bg-ink-400',
  brand: 'bg-brand-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-sky-500'
};

export function Badge({ tone = 'neutral', children, className = '', dot = false }) {
  return (
    <span
      className={`pill ${tones[tone]} ${className}`}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dots[tone]}`} />
      )}
      {children}
    </span>
  );
}

export function statusTone(status) {
  const map = {
    active: 'success',
    verified: 'success',
    approved: 'success',
    accepted: 'success',
    passed: 'success',
    completed: 'success',
    pending: 'warning',
    in_progress: 'info',
    submitted: 'info',
    revision: 'warning',
    unverified: 'neutral',
    draft: 'neutral',
    closed: 'neutral',
    rejected: 'danger',
    suspended: 'danger',
    cancelled: 'danger',
    failed: 'danger'
  };
  return map[status] || 'neutral';
}

export default Badge;