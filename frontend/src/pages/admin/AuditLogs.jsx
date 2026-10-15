import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Select from '../../components/ui/Select.jsx';
import Table from '../../components/ui/Table.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { adminService } from '../../services/admin.service.js';
import { formatDateTime, titleCase } from '../../utils/format.js';
import { usePagination } from '../../hooks/usePagination.js';

export default function AuditLogs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [severity, setSeverity] = useState('');
  const { page, limit, totalPages, setPage, setTotal } = usePagination(1, 20);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.listAuditLogs({
        page,
        limit,
        severity: severity || undefined
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
  }, [severity, page]);

  const toneFor = (sev) => {
    const map = { info: 'info', warning: 'warning', critical: 'danger', error: 'danger' };
    return map[sev] || 'neutral';
  };

  const columns = [
    {
      key: 'action',
      label: 'Action',
      render: (row) => <span className="font-medium text-ink-900">{row.action}</span>
    },
    {
      key: 'actor',
      label: 'Actor',
      render: (row) => (
        <span className="text-sm text-ink-700">{row.actorEmail || row.actor?.email || 'system'}</span>
      )
    },
    {
      key: 'target',
      label: 'Target',
      render: (row) => (
        <span className="text-sm text-ink-600">
          {row.targetType ? `${row.targetType}${row.targetId ? `#${row.targetId}` : ''}` : '—'}
        </span>
      )
    },
    {
      key: 'severity',
      label: 'Severity',
      render: (row) => <Badge tone={toneFor(row.severity)}>{titleCase(row.severity || 'info')}</Badge>
    },
    {
      key: 'createdAt',
      label: 'When',
      render: (row) => <span className="text-sm text-ink-600">{formatDateTime(row.createdAt)}</span>
    }
  ];

  return (
    <div>
      <PageHeader title="Audit logs" subtitle="All sensitive admin and system actions." />

      <Card className="mb-6">
        <CardBody>
          <div className="max-w-xs">
            <Select label="Severity" value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="">All severities</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
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
            <EmptyState icon="📜" title="No audit logs" />
          ) : (
            <Table columns={columns} rows={items} rowKey={(r) => r._id} />
          )}
        </CardBody>
      </Card>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}