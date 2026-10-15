import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody, CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import { engagementService } from '../../services/engagement.service.js';
import { taskService } from '../../services/task.service.js';
import { reviewService } from '../../services/review.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDateTime, formatDate, titleCase } from '../../utils/format.js';
import { TASK_PRIORITY } from '../../utils/constants.js';

export default function EngagementDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [engagement, setEngagement] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [taskValues, setTaskValues] = useState({
    title: '',
    description: '',
    priority: 'medium',
    deadline: ''
  });
  const [creatingTask, setCreatingTask] = useState(false);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewValues, setReviewValues] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const [confirmComplete, setConfirmComplete] = useState({ open: false, loading: false });

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

  const onCreateTask = async (e) => {
    e.preventDefault();
    if (!taskValues.title.trim() || !taskValues.description.trim() || !taskValues.deadline) {
      toast.error('Fill all required fields');
      return;
    }
    setCreatingTask(true);
    try {
      await taskService.create({
        engagementId: id,
        title: taskValues.title,
        description: taskValues.description,
        priority: taskValues.priority,
        deadline: taskValues.deadline
      });
      toast.success('Task created');
      setNewTaskOpen(false);
      setTaskValues({ title: '', description: '', priority: 'medium', deadline: '' });
      load();
    } catch (err) {
      toast.error(err.message || 'Could not create task');
    } finally {
      setCreatingTask(false);
    }
  };

  const onApprove = async (taskId) => {
    try {
      await taskService.approve(taskId, {});
      toast.success('Task approved');
      load();
    } catch (err) {
      toast.error(err.message || 'Could not approve');
    }
  };

  const onRequestRevision = async (taskId) => {
    const feedback = window.prompt('Describe what needs revision:');
    if (!feedback) return;
    try {
      await taskService.requestRevision(taskId, { feedback });
      toast.success('Revision requested');
      load();
    } catch (err) {
      toast.error(err.message || 'Could not request revision');
    }
  };

  const onSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await reviewService.create({
        engagementId: id,
        rating: Number(reviewValues.rating),
        comment: reviewValues.comment
      });
      toast.success('Review submitted');
      setReviewOpen(false);
      setReviewValues({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.message || 'Could not submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const onComplete = async () => {
    setConfirmComplete((c) => ({ ...c, loading: true }));
    try {
      await engagementService.complete(id);
      toast.success('Engagement completed');
      setConfirmComplete({ open: false, loading: false });
      load();
    } catch (err) {
      toast.error(err.message || 'Could not complete');
      setConfirmComplete((c) => ({ ...c, loading: false }));
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;
  if (error) return <ErrorState message={error.message} onRetry={load} />;
  if (!engagement) return <EmptyState title="Engagement not found" />;

  const va = engagement.va || {};
  const vaUser = va.user || {};
  const vaName = `${vaUser.firstName || ''} ${vaUser.lastName || ''}`.trim() || 'VA';

  return (
    <div>
      <div className="mb-4">
        <Link to="/client/hiring" className="text-sm text-ink-500 hover:text-ink-800">
          ← Back to hiring
        </Link>
      </div>

      <PageHeader
        title={engagement.title || `Engagement with ${vaName}`}
        subtitle={`Started ${formatDate(engagement.createdAt)}`}
        action={
          <div className="flex gap-2">
            <Button onClick={() => setNewTaskOpen(true)}>+ New task</Button>
            {engagement.status === 'active' && (
              <Button variant="secondary" onClick={() => setReviewOpen(true)}>Leave review</Button>
            )}
            {engagement.status === 'active' && (
              <Button variant="danger" onClick={() => setConfirmComplete({ open: true, loading: false })}>
                Complete engagement
              </Button>
            )}
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge tone={statusTone(engagement.status)}>{titleCase(engagement.status)}</Badge>
            </div>
            <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-ink-500">VA</div>
                <Link to={`/client/vas/${va._id}`} className="font-medium text-brand-700">
                  {vaName}
                </Link>
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
        <CardHeader
          title={`Tasks (${tasks.length})`}
          action={<Button size="sm" onClick={() => setNewTaskOpen(true)}>+ Add task</Button>}
        />
        <CardBody>
          {tasks.length === 0 ? (
            <EmptyState
              icon="✅"
              title="No tasks yet"
              description="Create the first task for this engagement."
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
                      <p className="text-sm text-ink-600 mt-1 line-clamp-2">{t.description}</p>
                    </div>
                    {t.status === 'submitted' && (
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" variant="success" onClick={() => onApprove(t._id)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => onRequestRevision(t._id)}>
                          Revision
                        </Button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <Modal
        open={newTaskOpen}
        onClose={() => setNewTaskOpen(false)}
        title="New task"
        footer={
          <>
            <Button variant="secondary" onClick={() => setNewTaskOpen(false)}>Cancel</Button>
            <Button onClick={onCreateTask} loading={creatingTask}>Create task</Button>
          </>
        }
      >
        <form onSubmit={onCreateTask} className="space-y-4">
          <Input
            label="Title"
            value={taskValues.title}
            onChange={(e) => setTaskValues((v) => ({ ...v, title: e.target.value }))}
            required
          />
          <Textarea
            label="Description"
            rows={5}
            value={taskValues.description}
            onChange={(e) => setTaskValues((v) => ({ ...v, description: e.target.value }))}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Priority"
              value={taskValues.priority}
              onChange={(e) => setTaskValues((v) => ({ ...v, priority: e.target.value }))}
            >
              {Object.values(TASK_PRIORITY).map((p) => (
                <option key={p} value={p}>{titleCase(p)}</option>
              ))}
            </Select>
            <Input
              label="Deadline"
              type="datetime-local"
              value={taskValues.deadline}
              onChange={(e) => setTaskValues((v) => ({ ...v, deadline: e.target.value }))}
              required
            />
          </div>
        </form>
      </Modal>

      <Modal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title="Leave a review"
        footer={
          <>
            <Button variant="secondary" onClick={() => setReviewOpen(false)}>Cancel</Button>
            <Button onClick={onSubmitReview} loading={submittingReview}>Submit review</Button>
          </>
        }
      >
        <form onSubmit={onSubmitReview} className="space-y-4">
          <Select
            label="Rating"
            value={reviewValues.rating}
            onChange={(e) => setReviewValues((v) => ({ ...v, rating: e.target.value }))}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} ★</option>
            ))}
          </Select>
          <Textarea
            label="Comment"
            rows={5}
            value={reviewValues.comment}
            onChange={(e) => setReviewValues((v) => ({ ...v, comment: e.target.value }))}
            required
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmComplete.open}
        onClose={() => setConfirmComplete({ open: false, loading: false })}
        onConfirm={onComplete}
        title="Complete engagement?"
        message="Mark this engagement as completed. The VA will no longer be able to receive new tasks for it."
        confirmText="Complete"
        loading={confirmComplete.loading}
      />
    </div>
  );
}