import Button from './Button.jsx';

export function Pagination({ page, totalPages, onPageChange, disabled = false }) {
  if (totalPages <= 1) return null;

  const windowSize = 5;
  const start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  const pages = [];
  for (let i = start; i <= end; i += 1) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 1}
      >
        Prev
      </Button>
      {start > 1 && (
        <>
          <Button size="sm" variant="ghost" onClick={() => onPageChange(1)} disabled={disabled}>
            1
          </Button>
          {start > 2 && <span className="px-1 text-ink-400">…</span>}
        </>
      )}
      {pages.map((p) => (
        <Button
          key={p}
          size="sm"
          variant={p === page ? 'primary' : 'ghost'}
          onClick={() => onPageChange(p)}
          disabled={disabled}
        >
          {p}
        </Button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-ink-400">…</span>}
          <Button size="sm" variant="ghost" onClick={() => onPageChange(totalPages)} disabled={disabled}>
            {totalPages}
          </Button>
        </>
      )}
      <Button
        size="sm"
        variant="secondary"
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= totalPages}
      >
        Next
      </Button>
    </div>
  );
}

export default Pagination;