import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Table from '../../components/ui/Table.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import ScoreBadge from '../../components/common/ScoreBadge.jsx';
import { vaService } from '../../services/va.service.js';
import { formatDate } from '../../utils/format.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { usePagination } from '../../hooks/usePagination.js';

export default function VAs() {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 400);
  const [verified, setVerified] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { page, limit, totalPages, setPage, setTotal } = usePagination(1, 15);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await vaService.search({
        q: debounced || undefined,
        verified: verified || undefined,
        page,
        limit
      });
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
  }, [debounced, verified, page]);

  const columns = [
    {
      key: 'va',
      label: 'VA',
      render: (row) => {
        const u = row.user || {};
        return (
          <div className="flex items-center gap-3">
            <Avatar name={`${u.firstName || ''} ${u.lastName || ''}`} src={u.avatarUrl} size="sm" />
            <div className="min-w-0">
              <div className="font-medium text-ink-900 truncate">
                {u.firstName} {u.lastName}
              </div>
              <div className="text-xs text-ink-500 truncate">{row.headline || u.email}</div>
            </div>
          </div>
        );
      }
    },
    { key: 'country', label: 'Country', render: (row) => row.country || '—' },
    {
      key: 'verification',
      label: 'Verification',
      render: (row) => (
        <Badge tone={statusTone(row.verificationStatus)}>
          {row.verificationStatus || 'unverified'}
        </Badge>
      )
    },
    {
      key: 'perf',
      label: 'Performance',
      render: (row) => <ScoreBadge score={row.performance?.overallScore} label="Perf" />
    },
    {
      key: 'rate',
      label: 'Rate',
      render: (row) => <span className="text-sm text-ink-700">{row.hourlyRate ? `$${row.hourlyRate}/hr` : '—'}</span>
    },
    {
      key: 'joined',
      label: 'Joined',
      render: (row) => <span className="text-sm text-ink-600">{formatDate(row.createdAt)}</span>
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right',
      render: (row) => (
        <Link to={`/vas/${row._id}`} className="link text-sm">View →</Link>
      )
    }
  ];

  return (
    <div>
      <PageHeader title="Virtual Assistants" subtitle="All VA accounts." />

      <Card className="mb-6">
        <CardBody>
          <div className="grid sm:grid-cols-3 gap-3">
            <Input
              className="sm:col-span-2"
              label="Search"
              placeholder="Name or headline"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select label="Verification" value={verified} onChange={(e) => setVerified(e.target.value)}>
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </Select>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
          ) : error ? (
            <ErrorState message={error.message} onRetry={load} />
          ) : items.length === 0 ? (
            <EmptyState icon="🧑‍💻" title="No VAs found" />
          ) : (
            <Table columns={columns} rows={items} rowKey={(r) => r._id} />
          )}
        </CardBody>
      </Card>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}