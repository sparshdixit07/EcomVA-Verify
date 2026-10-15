// export function StatCard({ label, value, hint, tone = 'brand', icon }) {
//   const tones = {
//     brand: 'bg-brand-50 text-brand-700',
//     success: 'bg-emerald-50 text-emerald-700',
//     warning: 'bg-amber-50 text-amber-700',
//     danger: 'bg-red-50 text-red-700',
//     info: 'bg-sky-50 text-sky-700',
//     neutral: 'bg-ink-100 text-ink-700'
//   };
//   return (
//     <div className="card p-5">
//       <div className="flex items-start justify-between gap-3">
//         <div>
//           <div className="text-xs uppercase tracking-wide text-ink-500 font-semibold">{label}</div>
//           <div className="mt-2 text-2xl font-bold text-ink-900">{value}</div>
//           {hint && <div className="mt-1 text-xs text-ink-500">{hint}</div>}
//         </div>
//         {icon && (
//           <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${tones[tone]}`}>
//             {icon}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default StatCard;

export function StatCard({ label, value, hint, tone = 'brand', icon, trend }) {
  const tones = {
    brand: 'from-brand-500 to-accent-500',
    success: 'from-emerald-500 to-teal-500',
    warning: 'from-amber-500 to-orange-500',
    danger: 'from-red-500 to-rose-500',
    info: 'from-sky-500 to-cyan-500',
    neutral: 'from-ink-500 to-ink-700'
  };
  const bg = tones[tone] || tones.brand;

  return (
    <div className="card card-hover p-5 animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-ink-500 font-bold">
            {label}
          </div>
          <div className="mt-2 text-3xl font-bold text-ink-900 tracking-tight">
            {value}
          </div>
          {hint && <div className="mt-1 text-xs text-ink-500">{hint}</div>}
          {trend && (
            <div
              className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${
                trend.dir === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              <span>{trend.dir === 'up' ? '▲' : '▼'}</span>
              <span>{trend.value}</span>
              <span className="text-ink-400 font-normal">vs last week</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className={`h-11 w-11 rounded-xl bg-gradient-to-br ${bg} text-white flex items-center justify-center text-lg shadow-glow shrink-0`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;