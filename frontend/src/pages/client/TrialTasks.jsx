import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { trialTaskService } from '../../services/trialTask.service.js';
import { formatDateTime, titleCase } from '../../utils/format.js';
import { usePagination } from '../../hooks/usePagination.js';

export default function TrialTasks() {
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

  return (
    <div>
      <PageHeader
        title="Trial tasks"
        subtitle="Practical work simulations you've assigned."
        action={<Link to="/client/find-vas" className="link text-sm">Assign new trial →</Link>}
      />

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
              description="Create a practical trial task to test a VA's real skills."
              actionTo="/client/find-vas"
              actionLabel="Find VAs"
            />
          </CardBody>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((t) => {
              const va = t.va || {};
              const vaUser = va.user || {};
              const name = `${vaUser.firstName || ''} ${vaUser.lastName || ''}`.trim() || 'VA';
              return (
                <Card key={t._id}>
                  <CardBody>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Link
                            to={`/client/trial-tasks/${t._id}`}
                            className="font-semibold text-ink-900 hover:text-brand-700"
                          >
                            {t.title}
                          </Link>
                          <Badge tone={statusTone(t.status)}>{titleCase(t.status)}</Badge>
                        </div>
                        <div className="text-sm text-ink-500 mt-1">Assigned to {name}</div>
                        <div className="text-xs text-ink-500 mt-1">
                          Deadline: {formatDateTime(t.deadline)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/client/trial-tasks/${t._id}`} className="link text-sm">
                          Open →
                        </Link>
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