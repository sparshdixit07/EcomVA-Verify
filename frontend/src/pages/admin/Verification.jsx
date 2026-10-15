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
import Select from '../../components/ui/Select.jsx';
import Tabs from '../../components/ui/Tabs.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import ScoreBadge from '../../components/common/ScoreBadge.jsx';
import { verificationService } from '../../services/verification.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDateTime, titleCase } from '../../utils/format.js';

export default function Verification() {
  const toast = useToast();
  const [tab, setTab] = useState('pending');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decision, setDecision] = useState({ open: false, item: null, status: 'verified', reason: '', loading: false });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await verificationService.list({ status: tab, limit: 50 });
      setItems(res?.items || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const onDecide = async () => {
    setDecision((d) => ({ ...d, loading: true }));
    try {
      await verificationService.decide(decision.item._id, {
        status: decision.status,
        reason: decision.reason
      });
      toast.success(`Verification ${decision.status}`);
      setDecision({ open: false, item: null, status: 'verified', reason: '', loading: false });
      load();
    } catch (err) {
      toast.error(err.message || 'Failed');
      setDecision((d) => ({ ...d, loading: false }));
    }
  };

  return (
    <div>
      <PageHeader
        title="VA Verification"
        subtitle="Review and decide on verification requests."
      />

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'pending', label: 'Pending' },
          { value: 'verified', label: 'Verified' },
          { value: 'rejected', label: 'Rejected' },
          { value: 'all', label: 'All' }
        ]}
        className="mb-6"
      />

      {loading ? (
        <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
      ) : error ? (
        <ErrorState message={error.message} onRetry={load} />
      ) : items.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState icon="🛡️" title="Nothing here" description="No verification requests in this queue." />
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((v) => {
            const va = v.va || {};
            const u = va.user || {};
            const name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'VA';
            return (
              <Card key={v._id}>
                <CardBody>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <Avatar name={name} src={u.avatarUrl} size="lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-ink-900">{name}</span>
                        <Badge tone={statusTone(v.status || 'pending')}>
                          {titleCase(v.status || 'pending')}
                        </Badge>
                      </div>
                      <div className="text-sm text-ink-500 mt-1">
                        {va.headline || 'E-commerce VA'} · {va.country || '—'}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-ink-500">
                        <span>Skills: {(va.skills || []).length}</span>
                        <span>Requested {formatDateTime(v.createdAt)}</span>
                      </div>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        <ScoreBadge score={va.performance?.overallScore} label="Perf" />
                        {va.assessmentAverage != null && (
                          <ScoreBadge score={va.assessmentAverage} label="Assess" />
                        )}
                        {va.practicalAverage != null && (
                          <ScoreBadge score={va.practicalAverage} label="Practical" />
                        )}
                      </div>
                      {v.reason && (
                        <div className="mt-2 text-sm text-ink-600 italic">Note: {v.reason}</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {v.status === 'pending' ? (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() =>
                              setDecision({ open: true, item: v, status: 'verified', reason: '', loading: false })
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() =>
                              setDecision({ open: true, item: v, status: 'rejected', reason: '', loading: false })
                            }
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Link to={`/vas/${va._id}`} className="link text-sm">
                          View profile →
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

      <Modal
        open={decision.open}
        onClose={() =>
          setDecision({ open: false, item: null, status: 'verified', reason: '', loading: false })
        }
        title={`${decision.status === 'verified' ? 'Approve' : 'Reject'} verification`}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() =>
                setDecision({ open: false, item: null, status: 'verified', reason: '', loading: false })
              }
            >
              Cancel
            </Button>
            <Button
              variant={decision.status === 'verified' ? 'success' : 'danger'}
              onClick={onDecide}
              loading={decision.loading}
            >
              Confirm
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Decision"
            value={decision.status}
            onChange={(e) => setDecision((d) => ({ ...d, status: e.target.value }))}
          >
            <option value="verified">Approve</option>
            <option value="rejected">Reject</option>
          </Select>
          <Textarea
            label="Note (optional)"
            rows={4}
            value={decision.reason}
            onChange={(e) => setDecision((d) => ({ ...d, reason: e.target.value }))}
          />
        </div>
      </Modal>
    </div>
  );
}