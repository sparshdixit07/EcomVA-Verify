import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { vaService } from '../../services/va.service.js';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Button from '../../components/ui/Button.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import ScoreBadge from '../../components/common/ScoreBadge.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { Spinner } from '../../components/ui/Spinner.jsx';
import { ENGLISH_LEVELS, ECOM_PLATFORMS, SKILL_CATEGORIES, PAGE_SIZE } from '../../utils/constants.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { usePagination } from '../../hooks/usePagination.js';

export default function FindVAs() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  const debounced = useDebounce(search, 400);

  const [platform, setPlatform] = useState(params.get('platform') || '');
  const [skill, setSkill] = useState(params.get('skill') || '');
  const [english, setEnglish] = useState(params.get('english') || '');
  const [verified, setVerified] = useState(params.get('verified') || '');
  const [sort, setSort] = useState(params.get('sort') || '-performance.overallScore');

  const { page, limit, total, totalPages, setPage, setTotal } = usePagination(
    1,
    PAGE_SIZE
  );
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = useMemo(() => {
    const q = {};
    if (debounced) q.q = debounced;
    if (platform) q.platform = platform;
    if (skill) q.skill = skill;
    if (english) q.english = english;
    if (verified) q.verified = verified;
    if (sort) q.sort = sort;
    q.page = page;
    q.limit = limit;
    return q;
  }, [debounced, platform, skill, english, verified, sort, page, limit]);

  useEffect(() => {
    const next = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== '' && v !== undefined && v !== null) next.set(k, String(v));
    });
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await vaService.search(query);
      setData({ items: res?.items || [], total: res?.total || 0 });
      setTotal(res?.total || 0);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const reset = () => {
    setSearch('');
    setPlatform('');
    setSkill('');
    setEnglish('');
    setVerified('');
    setSort('-performance.overallScore');
    setPage(1);
  };

  return (
    <div className="container-page py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">Find Virtual Assistants</h1>
          <p className="mt-2 text-ink-600">
            Browse verified Southeast Asian e-commerce VAs. Sign in to hire, compare and shortlist.
          </p>
        </div>
      </div>

      <div className="mt-8 card p-4 grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <Input
          className="lg:col-span-2"
          label="Search"
          placeholder="Name, headline, keyword"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select label="Platform" value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option value="">Any platform</option>
          {ECOM_PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </Select>
        <Select label="Skill" value={skill} onChange={(e) => setSkill(e.target.value)}>
          <option value="">Any skill</option>
          {SKILL_CATEGORIES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
        <Select label="English" value={english} onChange={(e) => setEnglish(e.target.value)}>
          <option value="">Any level</option>
          {ENGLISH_LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </Select>
        <Select label="Verification" value={verified} onChange={(e) => setVerified(e.target.value)}>
          <option value="">All</option>
          <option value="true">Verified only</option>
        </Select>
        <Select label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="-performance.overallScore">Performance</option>
          <option value="-createdAt">Newest</option>
          <option value="hourlyRate">Rate (low → high)</option>
          <option value="-hourlyRate">Rate (high → low)</option>
        </Select>
        <div className="sm:col-span-2 lg:col-span-6 flex justify-end">
          <Button variant="secondary" size="sm" onClick={reset}>
            Clear filters
          </Button>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <ErrorState message={error.message} onRetry={load} />
        ) : data.items.length === 0 ? (
          <EmptyState
            icon="🔎"
            title="No VAs match your filters"
            description="Try adjusting your filters or clearing them to see more candidates."
          />
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.items.map((va) => {
                const user = va.user || {};
                const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'VA';
                return (
                  <div key={va._id} className="card p-5 flex flex-col">
                    <div className="flex items-start gap-3">
                      <Avatar src={user.avatarUrl} name={name} size="lg" />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-ink-900 truncate">{name}</div>
                        <div className="text-sm text-ink-500 line-clamp-2">
                          {va.headline || 'E-commerce VA'}
                        </div>
                        <div className="mt-1 text-xs text-ink-400">
                          {va.country || '—'} · {va.timezone || '—'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(va.skills || []).slice(0, 3).map((s) => (
                        <span
                          key={s._id || s.name}
                          className="text-xs px-2 py-0.5 rounded-full bg-ink-100 text-ink-700"
                        >
                          {s.name || s.skill?.name || 'Skill'}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <ScoreBadge score={va.performance?.overallScore} label="Perf" />
                      {va.verificationStatus === 'verified' && (
                        <span className="text-xs text-emerald-700 font-medium">✓ Verified</span>
                      )}
                    </div>
                    <div className="mt-3 text-sm">
                      <span className="text-ink-500">Rate: </span>
                      <span className="font-semibold text-ink-900">
                        {va.hourlyRate ? `$${va.hourlyRate}/hr` : '—'}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" to={`/vas/${va._id}`} className="flex-1">
                        View profile
                      </Button>
                      <Button size="sm" variant="secondary" to="/login">
                        Hire
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}