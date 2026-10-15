import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Button from '../../components/ui/Button.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import ScoreBadge from '../../components/common/ScoreBadge.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { Spinner } from '../../components/ui/Spinner.jsx';
import { vaService } from '../../services/va.service.js';
import { shortlistService } from '../../services/shortlist.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import { usePagination } from '../../hooks/usePagination.js';
import {
  ECOM_PLATFORMS,
  ENGLISH_LEVELS,
  SKILL_CATEGORIES,
  PAGE_SIZE
} from '../../utils/constants.js';

const COMPARE_STORAGE_KEY = 'ecomva_compare_ids';

export function getCompareIds() {
  try {
    return JSON.parse(localStorage.getItem(COMPARE_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function setCompareIds(ids) {
  localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(ids.slice(0, 3)));
}

export default function FindVAs() {
  const toast = useToast();
  const [params, setParams] = useSearchParams();

  const [search, setSearch] = useState(params.get('q') || '');
  const debounced = useDebounce(search, 400);
  const [platform, setPlatform] = useState(params.get('platform') || '');
  const [skill, setSkill] = useState(params.get('skill') || '');
  const [english, setEnglish] = useState(params.get('english') || '');
  const [verified, setVerified] = useState(params.get('verified') || 'true');
  const [sort, setSort] = useState(params.get('sort') || '-performance.overallScore');

  const { page, limit, total, totalPages, setPage, setTotal } = usePagination(1, PAGE_SIZE);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [compare, setCompare] = useState(getCompareIds());

  const query = useMemo(() => {
    const q = { page, limit };
    if (debounced) q.q = debounced;
    if (platform) q.platform = platform;
    if (skill) q.skill = skill;
    if (english) q.english = english;
    if (verified) q.verified = verified;
    if (sort) q.sort = sort;
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
      setItems(res?.items || []);
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

  const onShortlist = async (vaId) => {
    try {
      await shortlistService.add({ vaId });
      toast.success('Added to shortlist');
    } catch (err) {
      toast.error(err.message || 'Could not add');
    }
  };

  const toggleCompare = (id) => {
    setCompare((prev) => {
      let next;
      if (prev.includes(id)) next = prev.filter((x) => x !== id);
      else if (prev.length >= 3) {
        toast.warning('You can compare up to 3 VAs');
        return prev;
      } else next = [...prev, id];
      setCompareIds(next);
      return next;
    });
  };

  return (
    <div>
      <PageHeader
        title="Find VAs"
        subtitle="Browse verified Southeast Asian e-commerce VAs."
        action={
          <Button to="/client/compare" variant="secondary" disabled={compare.length < 2}>
            Compare ({compare.length})
          </Button>
        }
      />

      <Card className="mb-6">
        <CardBody>
          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <Input
              className="lg:col-span-2"
              label="Search"
              placeholder="Name, skill, keyword"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select label="Platform" value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="">Any</option>
              {ECOM_PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </Select>
            <Select label="Skill" value={skill} onChange={(e) => setSkill(e.target.value)}>
              <option value="">Any</option>
              {SKILL_CATEGORIES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Select>
            <Select label="English" value={english} onChange={(e) => setEnglish(e.target.value)}>
              <option value="">Any</option>
              {ENGLISH_LEVELS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </Select>
            <Select label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="-performance.overallScore">Performance</option>
              <option value="-createdAt">Newest</option>
              <option value="hourlyRate">Rate ↑</option>
              <option value="-hourlyRate">Rate ↓</option>
            </Select>
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setSearch('');
                setPlatform('');
                setSkill('');
                setEnglish('');
                setSort('-performance.overallScore');
                setPage(1);
              }}
            >
              Clear
            </Button>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
      ) : error ? (
        <ErrorState message={error.message} onRetry={load} />
      ) : items.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="🔎"
              title="No VAs match your filters"
              description="Try clearing some filters to widen your search."
            />
          </CardBody>
        </Card>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((va) => {
              const vaUser = va.user || {};
              const name = `${vaUser.firstName || ''} ${vaUser.lastName || ''}`.trim() || 'VA';
              const isCompared = compare.includes(va._id);
              return (
                <Card key={va._id}>
                  <CardBody>
                    <div className="flex items-start gap-3">
                      <Avatar src={vaUser.avatarUrl} name={name} size="lg" />
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/client/vas/${va._id}`}
                          className="font-semibold text-ink-900 hover:text-brand-700 truncate block"
                        >
                          {name}
                        </Link>
                        <div className="text-sm text-ink-500 line-clamp-2">
                          {va.headline || 'E-commerce VA'}
                        </div>
                        <div className="text-xs text-ink-400 mt-1">
                          {va.country || '—'} · {va.timezone || '—'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(va.skills || []).slice(0, 3).map((s, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-ink-100 text-ink-700">
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
                    <div className="mt-2 text-sm">
                      <span className="text-ink-500">Rate: </span>
                      <span className="font-semibold text-ink-900">
                        {va.hourlyRate ? `$${va.hourlyRate}/hr` : '—'}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" to={`/client/vas/${va._id}`} className="flex-1">
                        View
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => onShortlist(va._id)}>
                        ⭐
                      </Button>
                      <Button
                        size="sm"
                        variant={isCompared ? 'primary' : 'secondary'}
                        onClick={() => toggleCompare(va._id)}
                      >
                        {isCompared ? '✓' : '+'}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}