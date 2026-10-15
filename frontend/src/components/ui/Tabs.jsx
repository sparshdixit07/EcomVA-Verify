export function Tabs({ tabs = [], value, onChange, className = '' }) {
  return (
    <div className={`border-b border-ink-200 ${className}`}>
      <nav className="flex gap-1 overflow-x-auto">
        {tabs.map((t) => {
          const active = t.value === value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange(t.value)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                active
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-ink-500 hover:text-ink-800'
              }`}
            >
              {t.label}
              {typeof t.count === 'number' && (
                <span className="ml-2 text-xs bg-ink-100 text-ink-600 px-1.5 py-0.5 rounded-full">
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default Tabs;