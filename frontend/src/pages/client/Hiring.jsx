import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import { hiringService } from '../../services/hiring.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDateTime, titleCase } from '../../utils/format.js';

export default function Hiring() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null, loading: false });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await hiringService.listMine({});
      setItems(res?.items || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCancel = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await hiringService.cancel(confirm.id);
      toast.success('Hiring request cancelled');
      setConfirm({ open: false, id: null, loading: false });
      load();
    } catch (err) {
      toast.error(err.message || 'Could not cancel');
      setConfirm((c) => ({ ...c, loading: false }));
    }
  };

  const onComplete = async (id) => {
    try {
      await hiringService.complete(id);
      toast.success('Engagement completed');
      load();
    } catch (err) {
      toast.error(err.message || 'Could not complete');
    }
  };

  return (
    <div>
      <PageHeader
        title="Hiring"
        subtitle="Your hiring requests and active engagements."
      />

      {loading ? (
        <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
      ) : error ? (
        <ErrorState message={error.message} onRetry={load} />
      ) : items.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="🤝"
              title="No hiring requests yet"
              description="Find a VA and send a hiring request to get started."
              actionTo="/client/find-vas"
              actionLabel="Find VAs"
            />
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((h) => {
            const va = h.va || {};
            const vaUser = va.user || {};
            const name = `${vaUser.firstName || ''} ${vaUser.lastName || ''}`.trim() || 'VA';
            return (
              <Card key={h._id}>
                <CardBody>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-ink-900">{name}</span>
                        <Badge tone={statusTone(h.status)}>{titleCase(h.status)}</Badge>
                      </div>
                      <div className="text-sm text-ink-500 mt-1">
                        Requested {formatDateTime(h.createdAt)}
                      </div>
                      {h.message && (
                        <p className="mt-2 text-sm text-ink-700 line-clamp-2">{h.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {h.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setConfirm({ open: true, id: h._id, loading: false })}
                        >
                          Cancel
                        </Button>
                      )}
                      {h.status === 'active' && h.engagement?._id && (
                        <>
                          <Button size="sm" to={`/client/engagements/${h.engagement._id}`}>
                            Open engagement
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => onComplete(h._id)}>
                            Mark completed
                          </Button>
                        </>
                      )}
                      {h.status === 'active' && !h.engagement?._id && (
                        <Link to={`/client/vas/${va._id}`} className="link text-sm">
                          View VA →
                        </Link>
                      )}
                      {['rejected', 'cancelled', 'completed'].includes(h.status) && (
                        <Link to={`/client/vas/${va._id}`} className="link text-sm">
                          View VA →
                        </Link>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null, loading: false })}
        onConfirm={onCancel}
        title="Cancel hiring request?"
        message="This will cancel the pending hiring request."
        confirmText="Cancel request"
        loading={confirm.loading}
      />
    </div>
  );
}