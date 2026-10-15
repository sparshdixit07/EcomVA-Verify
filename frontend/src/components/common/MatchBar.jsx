// export function MatchBar({ score = 0, label = 'Match' }) {
//   const n = Math.max(0, Math.min(100, Number(score) || 0));
//   const tone =
//     n >= 85 ? 'bg-emerald-500' : n >= 70 ? 'bg-brand-500' : n >= 50 ? 'bg-amber-500' : 'bg-red-500';
//   return (
//     <div>
//       <div className="flex justify-between text-xs font-medium text-ink-600">
//         <span>{label}</span>
//         <span>{Math.round(n)}%</span>
//       </div>
//       <div className="mt-1 h-2 w-full rounded-full bg-ink-100 overflow-hidden">
//         <div className={`h-full rounded-full ${tone}`} style={{ width: `${n}%` }} />
//       </div>
//     </div>
//   );
// }

// export default MatchBar;
export function MatchBar({ score = 0, label = 'Match', size = 'md' }) {
  const n = Math.max(0, Math.min(100, Number(score) || 0));
  const gradient =
    n >= 85
      ? 'from-emerald-500 to-teal-500'
      : n >= 70
      ? 'from-brand-500 to-accent-500'
      : n >= 50
      ? 'from-amber-500 to-orange-500'
      : 'from-red-500 to-rose-500';
  const h = size === 'sm' ? 'h-1.5' : 'h-2';
  return (
    <div>
      <div className="flex justify-between text-xs font-medium text-ink-600 mb-1.5">
        <span>{label}</span>
        <span className="font-bold text-ink-900">{Math.round(n)}%</span>
      </div>
      <div className={`w-full rounded-full bg-ink-100 overflow-hidden ${h}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700 ease-smooth`}
          style={{ width: `${n}%` }}
        />
      </div>
    </div>
  );
}

export default MatchBar;