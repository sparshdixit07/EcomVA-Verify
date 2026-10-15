import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import Select from '../../components/ui/Select.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import { reviewService } from '../../services/review.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDate } from '../../utils/format.js';
import { usePagination } from '../../hooks/usePagination.js';

export default function Reviews() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const { page, limit, totalPages, setPage, setTotal } = usePagination(1, 15);
  const [mod, setMod] = useState({ open: false, item: null, status: 'published', reason: '', loading: false });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reviewService.listAll({ page, limit, status: status || undefined });
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

  const onModerate = async () => {
    setMod((m) => ({ ...m, loading: true }));
    try {
      await reviewService.moderate(mod.item._id, { status: mod.status, reason: mod.reason });
      toast.success('Review moderated');
      setMod({ open: false, item: null, status: 'published', reason: '', loading: false });
      load();
    } catch (err) {
      toast.error(err.message || 'Failed');
      setMod((m) => ({ ...m, loading: false }));
    }
  };

  return (
    <div>
      <PageHeader title="Reviews" subtitle="Moderate client reviews." />

      <Card className="mb-6">
        <CardBody>
          <div className="max-w-xs">
            <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="hidden">Hidden</option>
              <option value="flagged">Flagged</option>
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
            <EmptyState icon="💬" title="No reviews found" />
          </CardBody>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((r) => (
              <Card key={r._id}>
                <CardBody>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-ink-900">
                          {r.va?.user?.firstName} {r.va?.user?.lastName}
                        </span>
                        <Badge tone={statusTone(r.status || 'published')}>
                          {r.status || 'published'}
                        </Badge>
                        <span className="text-amber-500 text-sm">{'★'.repeat(r.rating || 0)}</span>
                      </div>
                      <div className="text-xs text-ink-500 mt-1">
                        by {r.client?.companyName || r.client?.user?.email || 'Client'} ·{' '}
                        {formatDate(r.createdAt)}
                      </div>
                      <p className="text-sm text-ink-700 mt-2">{r.comment}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        setMod({
                          open: true,
                          item: r,
                          status: r.status || 'published',
                          reason: '',
                          loading: false
                        })
                      }
                    >
                      Moderate
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal
        open={mod.open}
        onClose={() => setMod({ open: false, item: null, status: 'published', reason: '', loading: false })}
        title="Moderate review"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setMod({ open: false, item: null, status: 'published', reason: '', loading: false })}
            >
              Cancel
            </Button>
            <Button onClick={onModerate} loading={mod.loading}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="New status"
            value={mod.status}
            onChange={(e) => setMod((m) => ({ ...m, status: e.target.value }))}
          >
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
            <option value="flagged">Flagged</option>
          </Select>
          <Textarea
            label="Reason (optional)"
            rows={3}
            value={mod.reason}
            onChange={(e) => setMod((m) => ({ ...m, reason: e.target.value }))}
          />
        </div>
      </Modal>
    </div>
  );
}