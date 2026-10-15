// const toneStyles = {
//   success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
//   error: 'bg-red-50 border-red-200 text-red-900',
//   info: 'bg-sky-50 border-sky-200 text-sky-900',
//   warning: 'bg-amber-50 border-amber-200 text-amber-900'
// };

// const icons = {
//   success: '✓',
//   error: '!',
//   info: 'i',
//   warning: '⚠'
// };

// export function Toast({ toast, onClose }) {
//   const tone = toneStyles[toast.type] || toneStyles.info;
//   return (
//     <div className={`rounded-xl border shadow-lg px-4 py-3 ${tone} flex items-start gap-3`}>
//       <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/70 text-xs font-bold">
//         {icons[toast.type] || 'i'}
//       </span>
//       <div className="flex-1 min-w-0">
//         {toast.title && <div className="font-semibold text-sm">{toast.title}</div>}
//         {toast.message && <div className="text-sm opacity-90 break-words">{toast.message}</div>}
//       </div>
//       <button
//         onClick={onClose}
//         className="text-lg leading-none opacity-60 hover:opacity-100"
//         aria-label="Dismiss"
//       >
//         ×
//       </button>
//     </div>
//   );
// }

// export default Toast;

const toneStyles = {
  success: 'bg-white border-emerald-200 text-ink-800',
  error: 'bg-white border-red-200 text-ink-800',
  info: 'bg-white border-sky-200 text-ink-800',
  warning: 'bg-white border-amber-200 text-ink-800'
};

const iconBg = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-sky-500',
  warning: 'bg-amber-500'
};

const icons = {
  success: '✓',
  error: '!',
  info: 'i',
  warning: '⚠'
};

export function Toast({ toast, onClose }) {
  const tone = toneStyles[toast.type] || toneStyles.info;
  const bg = iconBg[toast.type] || iconBg.info;
  return (
    <div
      className={`rounded-xl border shadow-elevated px-4 py-3.5 ${tone} flex items-start gap-3 animate-slide-up`}
    >
      <span
        className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold shrink-0 ${bg}`}
      >
        {icons[toast.type] || 'i'}
      </span>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="font-semibold text-sm text-ink-900">{toast.title}</div>
        )}
        {toast.message && (
          <div className="text-sm text-ink-600 break-words mt-0.5">{toast.message}</div>
        )}
      </div>
      <button
        onClick={onClose}
        className="h-6 w-6 flex items-center justify-center rounded-md text-ink-400 hover:bg-ink-100 hover:text-ink-700 transition"
        aria-label="Dismiss"
      >
        <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
          <path
            d="M5 5L15 15M15 5L5 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default Toast;