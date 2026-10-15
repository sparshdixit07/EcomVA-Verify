import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import Select from '../../components/ui/Select.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Button from '../../components/ui/Button.jsx';
import { taskService } from '../../services/task.service.js';
import { formatDateTime, titleCase } from '../../utils/format.js';
import { usePagination } from '../../hooks/usePagination.js';
import { useToast } from '../../context/ToastContext.jsx';
import { TASK_STATUS } from '../../utils/constants.js';

export default function Tasks() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const { page, limit, totalPages, setPage, setTotal } = usePagination(1, 20);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskService.listMine({ page, limit, status: status || undefined });
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
  }, [page, status]);

  const onApprove = async (id) => {
    try {
      await taskService.approve(id, {});
      toast.success('Task approved');
      load();
    } catch (err) {
      toast.error(err.message || 'Failed');
    }
  };

  return (
    <div>
      <PageHeader title="Tasks" subtitle="All tasks assigned across your engagements." />

      <Card className="mb-6">
        <CardBody>
          <div className="max-w-xs">
            <Select label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              {Object.values(TASK_STATUS).map((s) => (
                <option key={s} value={s}>{titleCase(s)}</option>
              ))}
            </Select>
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
              icon="✅"
              title="No tasks found"
              description="Tasks you assign from an engagement will appear here."
              actionTo="/client/hiring"
              actionLabel="Go to engagements"
            />
          </CardBody>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((t) => {
              const eng = t.engagement || {};
              const vaUser = eng.va?.user || {};
              const vaName = `${vaUser.firstName || ''} ${vaUser.lastName || ''}`.trim() || 'VA';
              return (
                <Card key={t._id}>
                  <CardBody>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-ink-900">{t.title}</span>
                          <Badge tone={statusTone(t.status)}>{titleCase(t.status)}</Badge>
                          <Badge tone="neutral">{titleCase(t.priority)}</Badge>
                        </div>
                        <div className="text-xs text-ink-500 mt-1">
                          {vaName} · Deadline {formatDateTime(t.deadline)}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {t.status === 'submitted' && (
                          <Button size="sm" variant="success" onClick={() => onApprove(t._id)}>
                            Approve
                          </Button>
                        )}
                        {eng._id && (
                          <Link to={`/client/engagements/${eng._id}`} className="link text-sm self-center">
                            Open engagement →
                          </Link>
                        )}
                      </div>
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