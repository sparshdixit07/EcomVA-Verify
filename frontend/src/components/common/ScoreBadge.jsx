// export function ScoreBadge({ score, label = 'Score' }) {
//   if (score === null || score === undefined) return null;
//   const n = Number(score);
//   const tone =
//     n >= 85
//       ? 'bg-emerald-50 text-emerald-700'
//       : n >= 70
//       ? 'bg-sky-50 text-sky-700'
//       : n >= 50
//       ? 'bg-amber-50 text-amber-700'
//       : 'bg-red-50 text-red-700';
//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${tone}`}>
//       {label}: {Math.round(n)}/100
//     </span>
//   );
// }

// export default ScoreBadge;

export function ScoreBadge({ score, label = 'Score' }) {
  if (score === null || score === undefined) return null;
  const n = Number(score);
  const tone =
    n >= 85
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : n >= 70
      ? 'bg-sky-50 text-sky-700 ring-sky-200'
      : n >= 50
      ? 'bg-amber-50 text-amber-700 ring-amber-200'
      : 'bg-red-50 text-red-700 ring-red-200';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ${tone}`}
    >
      <span className="opacity-70 font-medium">{label}</span>
      <span>{Math.round(n)}</span>
    </span>
  );
}

export default ScoreBadge;