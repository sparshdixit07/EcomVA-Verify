import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Button from '../../components/ui/Button.jsx';
import { trialTaskService } from '../../services/trialTask.service.js';
import { formatDateTime, titleCase } from '../../utils/format.js';
import { usePagination } from '../../hooks/usePagination.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function TrialTasks() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { page, limit, totalPages, setPage, setTotal } = usePagination(1, 10);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await trialTaskService.listMine({ page, limit });
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

  const onAccept = async (id) => {
    try {
      await trialTaskService.accept(id);
      toast.success('Trial accepted');
      load();
    } catch (err) {
      toast.error(err.message || 'Could not accept');
    }
  };

  return (
    <div>
      <PageHeader title="Trial tasks" subtitle="Practical work simulations assigned to you." />

      {loading ? (
        <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
      ) : error ? (
        <ErrorState message={error.message} onRetry={load} />
      ) : items.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="🧪"
              title="No trial tasks yet"
              description="Clients will assign trial tasks from your profile."
            />
          </CardBody>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((t) => (
              <Card key={t._id}>
                <CardBody>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Link
                          to={`/va/trial-tasks/${t._id}`}
                          className="font-semibold text-ink-900 hover:text-brand-700"
                        >
                          {t.title}
                        </Link>
                        <Badge tone={statusTone(t.status)}>{titleCase(t.status)}</Badge>
                      </div>
                      <div className="text-sm text-ink-500 mt-1 line-clamp-2">{t.brief}</div>
                      <div className="text-xs text-ink-500 mt-1">
                        Deadline: {formatDateTime(t.deadline)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {t.status === 'assigned' && (
                        <Button size="sm" onClick={() => onAccept(t._id)}>Accept</Button>
                      )}
                      <Button size="sm" variant="secondary" to={`/va/trial-tasks/${t._id}`}>
                        Open
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}