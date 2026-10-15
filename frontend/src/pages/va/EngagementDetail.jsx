import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody, CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { engagementService } from '../../services/engagement.service.js';
import { taskService } from '../../services/task.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDateTime, formatDate, titleCase } from '../../utils/format.js';

export default function EngagementDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [engagement, setEngagement] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState({ open: false, task: null, content: '' });
  const [acting, setActing] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await engagementService.getById(id);
      setEngagement(res?.engagement || res);
      const tRes = await taskService.listByEngagement(id, { limit: 100 });
      setTasks(tRes?.items || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onStartTask = async (taskId) => {
    setActing(true);
    try {
      await taskService.start(taskId);
      toast.success('Task started');
      load();
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setActing(false);
    }
  };

  const onSubmit = async () => {
    if (!submitting.content.trim()) {
      toast.error('Submission content is required');
      return;
    }
    setActing(true);
    try {
      await taskService.submit(submitting.task._id, { content: submitting.content });
      toast.success('Task submitted');
      setSubmitting({ open: false, task: null, content: '' });
      load();
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setActing(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;
  if (error) return <ErrorState message={error.message} onRetry={load} />;
  if (!engagement) return <EmptyState title="Engagement not found" />;

  const clientUser = engagement.client?.user || {};
  const clientName =
    engagement.client?.companyName ||
    `${clientUser.firstName || ''} ${clientUser.lastName || ''}`.trim() ||
    'Client';

  return (
    <div>
      <div className="mb-4">
        <Link to="/va/hiring" className="text-sm text-ink-500 hover:text-ink-800">
          ← Back to hiring
        </Link>
      </div>

      <PageHeader
        title={engagement.title || `Engagement with ${clientName}`}
        subtitle={`Started ${formatDate(engagement.createdAt)}`}
      />

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge tone={statusTone(engagement.status)}>{titleCase(engagement.status)}</Badge>
            </div>
            <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-ink-500">Client</div>
                <div className="font-medium text-ink-900">{clientName}</div>
              </div>
              <div>
                <div className="text-ink-500">Rate</div>
                <div className="font-medium text-ink-900">
                  {engagement.rate ? `$${engagement.rate}/hr` : '—'}
                </div>
              </div>
              <div>
                <div className="text-ink-500">Hours / week</div>
                <div className="font-medium text-ink-900">{engagement.hoursPerWeek || '—'}</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title={`Tasks (${tasks.length})`} />
        <CardBody>
          {tasks.length === 0 ? (
            <EmptyState
              icon="✅"
              title="No tasks yet"
              description="Your client will assign tasks here."
            />
          ) : (
            <ul className="divide-y divide-ink-100">
              {tasks.map((t) => (
                <li key={t._id} className="py-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-ink-900">{t.title}</span>
                        <Badge tone={statusTone(t.status)}>{titleCase(t.status)}</Badge>
                        <Badge tone="neutral">{titleCase(t.priority)}</Badge>
                      </div>
                      <div className="text-xs text-ink-500 mt-1">
                        Deadline: {formatDateTime(t.deadline)}
                      </div>
                      <p className="text-sm text-ink-600 mt-1 line-clamp-3">{t.description}</p>
                      {t.revisionFeedback && (
                        <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                          <span className="font-semibold">Revision: </span>
                          {t.revisionFeedback}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {t.status === 'pending' && (
                        <Button size="sm" onClick={() => onStartTask(t._id)} loading={acting}>
                          Start
                        </Button>
                      )}
                      {(t.status === 'in_progress' || t.status === 'revision') && (
                        <Button
                          size="sm"
                          onClick={() => setSubmitting({ open: true, task: t, content: '' })}
                        >
                          Submit
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <Modal
        open={submitting.open}
        onClose={() => setSubmitting({ open: false, task: null, content: '' })}
        title={`Submit: ${submitting.task?.title || ''}`}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setSubmitting({ open: false, task: null, content: '' })}
            >
              Cancel
            </Button>
            <Button onClick={onSubmit} loading={acting}>Submit</Button>
          </>
        }
      >
        <Textarea
          label="Your work"
          rows={8}
          value={submitting.content}
          onChange={(e) => setSubmitting((s) => ({ ...s, content: e.target.value }))}
          hint="Paste the work, link, or describe what you completed."
          required
        />
      </Modal>
    </div>
  );
}