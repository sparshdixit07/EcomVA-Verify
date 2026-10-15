// export function Card({ className = '', children, ...rest }) {
//   return (
//     <div className={`card ${className}`} {...rest}>
//       {children}
//     </div>
//   );
// }

// export function CardHeader({ title, subtitle, action, className = '' }) {
//   return (
//     <div className={`flex items-start justify-between gap-4 px-5 py-4 border-b border-ink-100 ${className}`}>
//       <div className="min-w-0">
//         {title && <h3 className="font-semibold text-ink-900 truncate">{title}</h3>}
//         {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
//       </div>
//       {action && <div className="shrink-0">{action}</div>}
//     </div>
//   );
// }

// export function CardBody({ className = '', children }) {
//   return <div className={`px-5 py-4 ${className}`}>{children}</div>;
// }

// export function CardFooter({ className = '', children }) {
//   return (
//     <div className={`px-5 py-3 border-t border-ink-100 bg-ink-50/40 rounded-b-2xl ${className}`}>
//       {children}
//     </div>
//   );
// }

// export default Card;

export function Card({ className = '', hover = false, children, ...rest }) {
  return (
    <div
      className={`card ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div
      className={`flex items-start justify-between gap-4 px-5 py-4 border-b border-ink-100 ${className}`}
    >
      <div className="min-w-0">
        {title && (
          <h3 className="font-semibold text-ink-900 tracking-tight truncate">{title}</h3>
        )}
        {subtitle && <p className="text-[13px] text-ink-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ className = '', children }) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ className = '', children }) {
  return (
    <div
      className={`px-5 py-3.5 border-t border-ink-100 bg-ink-50/50 rounded-b-2xl ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;