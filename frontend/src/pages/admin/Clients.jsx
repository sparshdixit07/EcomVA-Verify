import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Table from '../../components/ui/Table.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import { clientService } from '../../services/client.service.js';
import { formatDate } from '../../utils/format.js';
import { usePagination } from '../../hooks/usePagination.js';

export default function Clients() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { page, limit, totalPages, setPage, setTotal } = usePagination(1, 15);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await clientService.list({ page, limit });
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
  }, [page]);

  const columns = [
    {
      key: 'company',
      label: 'Company',
      render: (row) => {
        const u = row.user || {};
        return (
          <div className="flex items-center gap-3">
            <Avatar
              name={row.companyName || `${u.firstName || ''} ${u.lastName || ''}`}
              src={u.avatarUrl}
              size="sm"
            />
            <div className="min-w-0">
              <div className="font-medium text-ink-900 truncate">
                {row.companyName || 'Unnamed'}
              </div>
              <div className="text-xs text-ink-500 truncate">
                {u.email || '—'}
              </div>
            </div>
          </div>
        );
      }
    },
    { key: 'platform', label: 'Platform', render: (row) => <Badge>{row.platform || '—'}</Badge> },
    { key: 'country', label: 'Country', render: (row) => row.country || '—' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge tone={statusTone(row.user?.status || 'active')}>{row.user?.status || 'active'}</Badge>
    },
    {
      key: 'createdAt',
      label: 'Registered',
      render: (row) => <span className="text-sm text-ink-600">{formatDate(row.createdAt)}</span>
    }
  ];

  return (
    <div>
      <PageHeader title="Clients" subtitle="All client/store accounts." />

      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
          ) : error ? (
            <ErrorState message={error.message} onRetry={load} />
          ) : items.length === 0 ? (
            <EmptyState icon="🏢" title="No clients found" />
          ) : (
            <Table columns={columns} rows={items} rowKey={(r) => r._id} />
          )}
        </CardBody>
      </Card>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}