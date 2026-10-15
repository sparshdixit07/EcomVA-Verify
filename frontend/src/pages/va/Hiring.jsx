import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import { hiringService } from '../../services/hiring.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDateTime, titleCase } from '../../utils/format.js';

export default function Hiring() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejecting, setRejecting] = useState({ open: false, id: null, reason: '' });
  const [acting, setActing] = useState(false);

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

  const onAccept = async (id) => {
    setActing(true);
    try {
      await hiringService.accept(id);
      toast.success('Hiring request accepted');
      load();
    } catch (err) {
      toast.error(err.message || 'Could not accept');
    } finally {
      setActing(false);
    }
  };

  const onReject = async () => {
    setActing(true);
    try {
      await hiringService.reject(rejecting.id, rejecting.reason);
      toast.success('Hiring request rejected');
      setRejecting({ open: false, id: null, reason: '' });
      load();
    } catch (err) {
      toast.error(err.message || 'Could not reject');
    } finally {
      setActing(false);
    }
  };

  return (
    <div>
      <PageHeader title="Hiring requests" subtitle="Requests from clients." />

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
              description="Complete your profile and assessments to attract client requests."
            />
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((h) => {
            const clientUser = h.client?.user || {};
            const clientName =
              h.client?.companyName ||
              `${clientUser.firstName || ''} ${clientUser.lastName || ''}`.trim() ||
              'Client';
            return (
              <Card key={h._id}>
                <CardBody>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-ink-900">{clientName}</span>
                        <Badge tone={statusTone(h.status)}>{titleCase(h.status)}</Badge>
                      </div>
                      <div className="text-sm text-ink-500 mt-1">
                        Received {formatDateTime(h.createdAt)}
                      </div>
                      {h.message && (
                        <p className="mt-2 text-sm text-ink-700">{h.message}</p>
                      )}
                      {h.proposedRate && (
                        <div className="text-sm text-ink-600 mt-1">
                          Proposed rate: ${h.proposedRate}/hr
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {h.status === 'pending' && (
                        <>
                          <Button size="sm" onClick={() => onAccept(h._id)} loading={acting}>
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => setRejecting({ open: true, id: h._id, reason: '' })}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {h.status === 'active' && h.engagement?._id && (
                        <Button size="sm" to={`/va/engagements/${h.engagement._id}`}>
                          Open engagement
                        </Button>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={rejecting.open}
        onClose={() => setRejecting({ open: false, id: null, reason: '' })}
        title="Reject hiring request"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setRejecting({ open: false, id: null, reason: '' })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={onReject} loading={acting}>
              Reject
            </Button>
          </>
        }
      >
        <Textarea
          label="Reason (optional)"
          rows={4}
          value={rejecting.reason}
          onChange={(e) => setRejecting((r) => ({ ...r, reason: e.target.value }))}
        />
      </Modal>
    </div>
  );
}