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
import { reportService } from '../../services/report.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDateTime, titleCase } from '../../utils/format.js';
import { usePagination } from '../../hooks/usePagination.js';

export default function Reports() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const { page, limit, totalPages, setPage, setTotal } = usePagination(1, 15);
  const [resolve, setResolve] = useState({ open: false, item: null, status: 'resolved', resolution: '', loading: false });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportService.list({ page, limit, status: status || undefined });
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

  const onResolve = async () => {
    setResolve((r) => ({ ...r, loading: true }));
    try {
      await reportService.resolve(resolve.item._id, {
        status: resolve.status,
        resolution: resolve.resolution
      });
      toast.success('Report updated');
      setResolve({ open: false, item: null, status: 'resolved', resolution: '', loading: false });
      load();
    } catch (err) {
      toast.error(err.message || 'Failed');
      setResolve((r) => ({ ...r, loading: false }));
    }
  };

  return (
    <div>
      <PageHeader title="Reports" subtitle="User-submitted reports and flags." />

      <Card className="mb-6">
        <CardBody>
          <div className="max-w-xs">
            <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>
              <option value="open">Open</option>
              <option value="reviewing">Reviewing</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
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
            <EmptyState icon="🚩" title="No reports found" />
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
                        <span className="font-medium text-ink-900">{titleCase(r.type || 'report')}</span>
                        <Badge tone={statusTone(r.status)}>{titleCase(r.status)}</Badge>
                      </div>
                      <div className="text-xs text-ink-500 mt-1">
                        By {r.reporter?.email || 'unknown'} · {formatDateTime(r.createdAt)}
                      </div>
                      {r.subject && <div className="text-sm font-medium mt-2">{r.subject}</div>}
                      <p className="text-sm text-ink-700 mt-1">{r.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        setResolve({
                          open: true,
                          item: r,
                          status: r.status === 'open' ? 'reviewing' : 'resolved',
                          resolution: '',
                          loading: false
                        })
                      }
                    >
                      Update
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
        open={resolve.open}
        onClose={() => setResolve({ open: false, item: null, status: 'resolved', resolution: '', loading: false })}
        title="Update report"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setResolve({ open: false, item: null, status: 'resolved', resolution: '', loading: false })}
            >
              Cancel
            </Button>
            <Button onClick={onResolve} loading={resolve.loading}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="New status"
            value={resolve.status}
            onChange={(e) => setResolve((r) => ({ ...r, status: e.target.value }))}
          >
            <option value="open">Open</option>
            <option value="reviewing">Reviewing</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </Select>
          <Textarea
            label="Resolution notes"
            rows={4}
            value={resolve.resolution}
            onChange={(e) => setResolve((r) => ({ ...r, resolution: e.target.value }))}
          />
        </div>
      </Modal>
    </div>
  );
}