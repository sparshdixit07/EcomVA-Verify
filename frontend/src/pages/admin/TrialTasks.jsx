import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Select from '../../components/ui/Select.jsx';
import Table from '../../components/ui/Table.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import { trialTaskService } from '../../services/trialTask.service.js';
import { formatDateTime, titleCase } from '../../utils/format.js';
import { usePagination } from '../../hooks/usePagination.js';

export default function TrialTasks() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const { page, limit, totalPages, setPage, setTotal } = usePagination(1, 15);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await trialTaskService.listMine({ page, limit, status: status || undefined, scope: 'admin' });
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
  }, [status, page]);

  const columns = [
    { key: 'title', label: 'Title' },
    {
      key: 'va',
      label: 'VA',
      render: (row) => {
        const u = row.va?.user || {};
        return `${u.firstName || ''} ${u.lastName || ''}`.trim() || '—';
      }
    },
    {
      key: 'client',
      label: 'Client',
      render: (row) => row.client?.companyName || row.client?.user?.email || '—'
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge tone={statusTone(row.status)}>{titleCase(row.status)}</Badge>
    },
    {
      key: 'deadline',
      label: 'Deadline',
      render: (row) => <span className="text-sm text-ink-600">{formatDateTime(row.deadline)}</span>
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right',
      render: (row) => <Link to={`/client/trial-tasks/${row._id}`} className="link text-sm">View</Link>
    }
  ];

  return (
    <div>
      <PageHeader title="Trial tasks" subtitle="Monitor practical work simulations across the platform." />

      <Card className="mb-6">
        <CardBody>
          <div className="max-w-xs">
            <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>
              <option value="assigned">Assigned</option>
              <option value="accepted">Accepted</option>
              <option value="submitted">Submitted</option>
              <option value="passed">Passed</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
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
            <EmptyState icon="🧪" title="No trial tasks found" />
          ) : (
            <Table columns={columns} rows={items} rowKey={(r) => r._id} />
          )}
        </CardBody>
      </Card>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}