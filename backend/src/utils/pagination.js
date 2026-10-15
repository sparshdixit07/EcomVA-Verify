export function parsePagination(query, defaults = { page: 1, limit: 20, maxLimit: 100 }) {
  const page = Math.max(1, parseInt(query.page, 10) || defaults.page);
  const rawLimit = parseInt(query.limit, 10) || defaults.limit;
  const limit = Math.min(defaults.maxLimit, Math.max(1, rawLimit));
  return { page, limit, skip: (page - 1) * limit };
}

export function paginated(items, total, page, limit) {
  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit))
  };
}

export function parseSort(sort, allowed, fallback = '-createdAt') {
  if (!sort || typeof sort !== 'string') return fallback;
  const first = sort.split(',')[0].trim();
  const field = first.startsWith('-') ? first.slice(1) : first;
  if (!allowed.includes(field)) return fallback;
  return first;
}