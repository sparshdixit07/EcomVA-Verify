// export function PageHeader({ title, subtitle, action }) {
//   return (
//     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
//       <div>
//         <h1 className="text-xl sm:text-2xl font-bold text-ink-900">{title}</h1>
//         {subtitle && <p className="text-sm text-ink-500 mt-1">{subtitle}</p>}
//       </div>
//       {action && <div className="shrink-0">{action}</div>}
//     </div>
//   );
// }

// export default PageHeader;


export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-[28px] font-bold text-ink-900 tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-ink-500 mt-1.5 max-w-2xl">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0 flex gap-2">{action}</div>}
    </div>
  );
}

export default PageHeader;