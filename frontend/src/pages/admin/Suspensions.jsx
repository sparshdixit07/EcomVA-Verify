import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Table from '../../components/ui/Table.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import { adminService } from '../../services/admin.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDate } from '../../utils/format.js';
import { usePagination } from '../../hooks/usePagination.js';

export default function Suspensions() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { page, limit, totalPages, setPage, setTotal } = usePagination(1, 15);
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.listUsers({ status: 'suspended', page, limit });
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

  const onActivate = async (id) => {
    setActionLoading(true);
    try {
      await adminService.activateUser(id);
      toast.success('User reactivated');
      load();
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar
            name={`${row.firstName || ''} ${row.lastName || ''}`}
            src={row.avatarUrl}
            size="sm"
          />
          <div className="min-w-0">
            <div className="font-medium text-ink-900 truncate">
              {row.firstName} {row.lastName}
            </div>
            <div className="text-xs text-ink-500 truncate">{row.email}</div>
          </div>
        </div>
      )
    },
    { key: 'role', label: 'Role', render: (row) => <Badge>{row.role}</Badge> },
    { key: 'status', label: 'Status', render: (row) => <Badge tone="danger">Suspended</Badge> },
    {
      key: 'reason',
      label: 'Reason',
      render: (row) => <span className="text-sm text-ink-600">{row.suspensionReason || '—'}</span>
    },
    {
      key: 'updatedAt',
      label: 'Since',
      render: (row) => <span className="text-sm text-ink-600">{formatDate(row.updatedAt)}</span>
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right',
      render: (row) => (
        <Button
          size="sm"
          variant="success"
          onClick={() => onActivate(row._id)}
          loading={actionLoading}
        >
          Reactivate
        </Button>
      )
    }
  ];

  return (
    <div>
      <PageHeader title="Suspensions" subtitle="Suspended accounts awaiting reactivation." />

      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
          ) : error ? (
            <ErrorState message={error.message} onRetry={load} />
          ) : items.length === 0 ? (
            <EmptyState icon="⛔" title="No suspended users" />
          ) : (
            <Table columns={columns} rows={items} rowKey={(r) => r._id} />
          )}
        </CardBody>
      </Card>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}