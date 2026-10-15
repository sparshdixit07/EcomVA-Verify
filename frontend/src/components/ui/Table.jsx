export function Table({ columns = [], rows = [], empty = null, loading = false, rowKey }) {
  if (loading) {
    return (
      <div className="py-10 text-center text-sm text-ink-500">Loading…</div>
    );
  }

  if (!rows.length) {
    return empty || <div className="py-10 text-center text-sm text-ink-500">No records.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase text-ink-500 border-b border-ink-100">
            {columns.map((c) => (
              <th key={c.key} className={`px-4 py-3 font-semibold ${c.className || ''}`}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={rowKey ? rowKey(row) : row._id || idx}
              className="border-b border-ink-100 hover:bg-ink-50/40"
            >
              {columns.map((c) => (
                <td key={c.key} className={`px-4 py-3 align-middle ${c.className || ''}`}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;