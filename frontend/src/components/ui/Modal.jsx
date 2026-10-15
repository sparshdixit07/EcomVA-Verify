// import { useEffect } from 'react';

// export function Modal({ open, onClose, title, children, footer, size = 'md' }) {
//   useEffect(() => {
//     if (!open) return;
//     const onKey = (e) => {
//       if (e.key === 'Escape') onClose?.();
//     };
//     document.addEventListener('keydown', onKey);
//     document.body.style.overflow = 'hidden';
//     return () => {
//       document.removeEventListener('keydown', onKey);
//       document.body.style.overflow = '';
//     };
//   }, [open, onClose]);

//   if (!open) return null;

//   const sizes = {
//     sm: 'max-w-md',
//     md: 'max-w-lg',
//     lg: 'max-w-2xl',
//     xl: 'max-w-4xl'
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-ink-900/40 backdrop-blur-sm"
//       onMouseDown={(e) => {
//         if (e.target === e.currentTarget) onClose?.();
//       }}
//     >
//       <div className={`w-full ${sizes[size]} bg-white rounded-2xl shadow-xl border border-ink-100 flex flex-col max-h-full`}>
//         <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
//           <h3 className="font-semibold text-ink-900">{title}</h3>
//           <button
//             onClick={onClose}
//             className="text-ink-400 hover:text-ink-700 text-xl leading-none px-1"
//             aria-label="Close"
//           >
//             ×
//           </button>
//         </div>
//         <div className="px-5 py-4 overflow-y-auto">{children}</div>
//         {footer && <div className="px-5 py-3 border-t border-ink-100 flex justify-end gap-2">{footer}</div>}
//       </div>
//     </div>
//   );
// }

// export default Modal;

import { useEffect } from 'react';

export function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-ink-950/50 backdrop-blur-sm animate-fade-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className={`w-full ${sizes[size]} bg-white rounded-2xl shadow-elevated border border-ink-100 flex flex-col max-h-full animate-slide-up`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
          <h3 className="font-semibold text-ink-900 tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-5 py-3.5 border-t border-ink-100 flex justify-end gap-2 bg-ink-50/50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;