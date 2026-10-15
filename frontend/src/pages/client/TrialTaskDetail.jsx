import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody, CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import Input from '../../components/ui/Input.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import ScoreBadge from '../../components/common/ScoreBadge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { trialTaskService } from '../../services/trialTask.service.js';
import { hiringService } from '../../services/hiring.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDateTime, titleCase } from '../../utils/format.js';

export default function TrialTaskDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState({ score: '', feedback: '', passed: true });
  const [submitting, setSubmitting] = useState(false);
  const [hiring, setHiring] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await trialTaskService.getById(id);
      setTask(res?.trialTask || res);
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

  const onReview = async (e) => {
    e.preventDefault();
    const score = Number(review.score);
    if (Number.isNaN(score) || score < 0 || score > 100) {
      toast.error('Score must be between 0 and 100');
      return;
    }
    setSubmitting(true);
    try {
      await trialTaskService.review(id, {
        score,
        feedback: review.feedback,
        passed: review.passed
      });
      toast.success('Review saved');
      load();
    } catch (err) {
      toast.error(err.message || 'Could not save review');
    } finally {
      setSubmitting(false);
    }
  };

  const onCancel = async () => {
    try {
      await trialTaskService.cancel(id);
      toast.success('Trial task cancelled');
      load();
    } catch (err) {
      toast.error(err.message || 'Could not cancel');
    }
  };

  const onHire = async () => {
    if (!task?.va?._id) return;
    setHiring(true);
    try {
      await hiringService.create({
        vaId: task.va._id,
        trialTaskId: task._id,
        message: `Following up on trial task "${task.title}".`
      });
      toast.success('Hiring request sent');
    } catch (err) {
      toast.error(err.message || 'Could not send hiring request');
    } finally {
      setHiring(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;
  if (error) return <ErrorState message={error.message} onRetry={load} />;
  if (!task) return <EmptyState title="Trial task not found" />;

  const va = task.va || {};
  const vaUser = va.user || {};
  const vaName = `${vaUser.firstName || ''} ${vaUser.lastName || ''}`.trim() || 'VA';
  const submission = task.submission;
  const reviewed = task.status === 'passed' || task.status === 'rejected' || task.status === 'reviewed';

  return (
    <div>
      <div className="mb-4">
        <Link to="/client/trial-tasks" className="text-sm text-ink-500 hover:text-ink-800">
          ← Back to trial tasks
        </Link>
      </div>

      <PageHeader
        title={task.title}
        subtitle={`Assigned to ${vaName}`}
        action={
          <div className="flex gap-2">
            {task.status === 'submitted' && (
              <Button onClick={onHire} loading={hiring}>Send hiring request</Button>
            )}
            {['assigned', 'accepted'].includes(task.status) && (
              <Button variant="danger" onClick={onCancel}>Cancel</Button>
            )}
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardBody>
              <div className="flex items-center gap-3 flex-wrap mb-4">
                <Badge tone={statusTone(task.status)}>{titleCase(task.status)}</Badge>
                <span className="text-sm text-ink-500">
                  Deadline: {formatDateTime(task.deadline)}
                </span>
              </div>
              <div className="text-sm text-ink-700 whitespace-pre-line">{task.brief}</div>
              {task.compensation > 0 && (
                <div className="mt-4 text-sm text-ink-600">
                  Compensation: <span className="font-semibold">${task.compensation}</span>
                </div>
              )}
            </CardBody>
          </Card>

          {submission ? (
            <Card>
              <CardHeader
                title="VA submission"
                subtitle={submission.submittedAt ? `Submitted ${formatDateTime(submission.submittedAt)}` : ''}
              />
              <CardBody>
                {submission.content && (
                  <div className="text-sm text-ink-700 whitespace-pre-line mb-4">
                    {submission.content}
                  </div>
                )}
                {submission.attachments?.length > 0 && (
                  <ul className="text-sm list-disc pl-5">
                    {submission.attachments.map((a, i) => (
                      <li key={i}>
                        <a href={a.url} target="_blank" rel="noopener noreferrer" className="link">
                          {a.filename || a.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody>
                <EmptyState
                  icon="⏳"
                  title="Awaiting submission"
                  description="The VA has not submitted work yet."
                />
              </CardBody>
            </Card>
          )}

          {submission && !reviewed && (
            <Card>
              <CardHeader title="Review submission" />
              <CardBody>
                <form onSubmit={onReview} className="space-y-4">
                  <Input
                    label="Score (0–100)"
                    type="number"
                    min="0"
                    max="100"
                    value={review.score}
                    onChange={(e) => setReview((r) => ({ ...r, score: e.target.value }))}
                    required
                  />
                  <Textarea
                    label="Feedback"
                    rows={5}
                    value={review.feedback}
                    onChange={(e) => setReview((r) => ({ ...r, feedback: e.target.value }))}
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={review.passed}
                      onChange={(e) => setReview((r) => ({ ...r, passed: e.target.checked }))}
                      className="h-4 w-4 rounded border-ink-300"
                    />
                    Pass the trial
                  </label>
                  <Button type="submit" loading={submitting}>Save review</Button>
                </form>
              </CardBody>
            </Card>
          )}

          {reviewed && task.review && (
            <Card>
              <CardHeader title="Review result" />
              <CardBody>
                <div className="flex items-center gap-3">
                  <ScoreBadge score={task.review.score} label="Score" />
                  <span className={task.review.passed ? 'text-emerald-700' : 'text-red-700'}>
                    {task.review.passed ? 'Passed' : 'Rejected'}
                  </span>
                </div>
                {task.review.feedback && (
                  <p className="mt-3 text-sm text-ink-700 whitespace-pre-line">{task.review.feedback}</p>
                )}
              </CardBody>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardBody>
              <div className="font-semibold text-ink-900 mb-3">VA</div>
              <div className="text-sm text-ink-700">{vaName}</div>
              {va.headline && <div className="text-xs text-ink-500 mt-1">{va.headline}</div>}
              <div className="mt-3">
                <Button size="sm" variant="secondary" to={`/client/vas/${va._id}`}>
                  View profile
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}