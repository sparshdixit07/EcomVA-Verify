import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { notificationService } from '../../services/notification.service.js';
import { formatRelative } from '../../utils/format.js';
import { usePagination } from '../../hooks/usePagination.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function Notifications() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { page, limit, totalPages, setPage, setTotal } = usePagination(1, 20);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationService.list({ page, limit });
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

  const markRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setItems((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (err) {
      toast.error(err.message || 'Failed');
    }
  };

  const markAll = async () => {
    try {
      await notificationService.markAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All marked read');
    } catch (err) {
      toast.error(err.message || 'Failed');
    }
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Activity from your engagements, trial tasks, and messages."
        action={
          <Button variant="secondary" size="sm" onClick={markAll}>
            Mark all read
          </Button>
        }
      />

      {loading ? (
        <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
      ) : error ? (
        <ErrorState message={error.message} onRetry={load} />
      ) : items.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState icon="🔔" title="No notifications" />
          </CardBody>
        </Card>
      ) : (
        <>
          <Card>
            <CardBody>
              <ul className="divide-y divide-ink-100">
                {items.map((n) => (
                  <li key={n._id} className={`py-3 ${n.read ? '' : 'bg-brand-50/40 -mx-3 px-3 rounded-lg'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-ink-900">
                          {n.link ? (
                            <Link to={n.link} className="hover:text-brand-700">
                              {n.title}
                            </Link>
                          ) : (
                            n.title
                          )}
                        </div>
                        <div className="text-sm text-ink-600 mt-0.5">{n.message}</div>
                        <div className="text-xs text-ink-400 mt-1">{formatRelative(n.createdAt)}</div>
                      </div>
                      {!n.read && (
                        <Button size="sm" variant="ghost" onClick={() => markRead(n._id)}>
                          Mark read
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}