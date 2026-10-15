import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody, CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import ScoreBadge from '../../components/common/ScoreBadge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { trialTaskService } from '../../services/trialTask.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDateTime, titleCase } from '../../utils/format.js';

export default function TrialTaskDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [accepting, setAccepting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await trialTaskService.getById(id);
      const t = res?.trialTask || res;
      setTask(t);
      setContent(t?.submission?.content || '');
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

  const onAccept = async () => {
    setAccepting(true);
    try {
      await trialTaskService.accept(id);
      toast.success('Trial accepted');
      load();
    } catch (err) {
      toast.error(err.message || 'Could not accept');
    } finally {
      setAccepting(false);
    }
  };

  const onSubmitWork = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Submission content is required');
      return;
    }
    setSubmitting(true);
    try {
      await trialTaskService.submit(id, { content });
      toast.success('Submitted');
      load();
    } catch (err) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;
  if (error) return <ErrorState message={error.message} onRetry={load} />;
  if (!task) return <EmptyState title="Trial task not found" />;

  const canSubmit = ['accepted', 'revision'].includes(task.status);
  const submission = task.submission;
  const review = task.review;

  return (
    <div>
      <div className="mb-4">
        <Link to="/va/trial-tasks" className="text-sm text-ink-500 hover:text-ink-800">
          ← Back to trial tasks
        </Link>
      </div>

      <PageHeader
        title={task.title}
        subtitle={`Deadline: ${formatDateTime(task.deadline)}`}
        action={
          task.status === 'assigned' ? (
            <Button onClick={onAccept} loading={accepting}>Accept task</Button>
          ) : null
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardBody>
              <div className="flex items-center gap-3 flex-wrap mb-4">
                <Badge tone={statusTone(task.status)}>{titleCase(task.status)}</Badge>
                {task.compensation > 0 && (
                  <span className="text-sm text-ink-600">
                    Compensation: <span className="font-semibold">${task.compensation}</span>
                  </span>
                )}
              </div>
              <div className="text-sm text-ink-700 whitespace-pre-line">{task.brief}</div>
            </CardBody>
          </Card>

          {canSubmit && (
            <Card>
              <CardHeader
                title={task.status === 'revision' ? 'Resubmit work' : 'Submit your work'}
              />
              <CardBody>
                {task.review?.feedback && task.status === 'revision' && (
                  <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
                    <div className="font-semibold mb-1">Revision feedback:</div>
                    <div className="whitespace-pre-line">{task.review.feedback}</div>
                  </div>
                )}
                <form onSubmit={onSubmitWork} className="space-y-4">
                  <Textarea
                    label="Work submission"
                    rows={10}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    hint="Paste your work, link to a deliverable, or describe what you did."
                    required
                  />
                  <Button type="submit" loading={submitting}>Submit work</Button>
                </form>
              </CardBody>
            </Card>
          )}

          {submission && !canSubmit && (
            <Card>
              <CardHeader title="Your submission" />
              <CardBody>
                <div className="text-sm text-ink-700 whitespace-pre-line">{submission.content}</div>
                {submission.submittedAt && (
                  <div className="text-xs text-ink-500 mt-2">
                    Submitted {formatDateTime(submission.submittedAt)}
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {review && (
            <Card>
              <CardHeader title="Client review" />
              <CardBody>
                <div className="flex items-center gap-3 mb-3">
                  <ScoreBadge score={review.score} label="Score" />
                  <span className={review.passed ? 'text-emerald-700' : 'text-red-700'}>
                    {review.passed ? 'Passed' : 'Not passed'}
                  </span>
                </div>
                {review.feedback && (
                  <p className="text-sm text-ink-700 whitespace-pre-line">{review.feedback}</p>
                )}
              </CardBody>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardBody>
              <div className="font-semibold text-ink-900 mb-2">Client</div>
              <div className="text-sm text-ink-700">
                {task.client?.companyName || 'Client'}
              </div>
              {task.client?.user && (
                <div className="text-xs text-ink-500 mt-1">
                  {task.client.user.firstName} {task.client.user.lastName}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}