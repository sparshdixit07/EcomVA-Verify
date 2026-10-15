import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody, CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import ScoreBadge from '../../components/common/ScoreBadge.jsx';
import MatchBar from '../../components/common/MatchBar.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Input from '../../components/ui/Input.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Select from '../../components/ui/Select.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { vaService } from '../../services/va.service.js';
import { shortlistService } from '../../services/shortlist.service.js';
import { hiringService } from '../../services/hiring.service.js';
import { trialTaskService } from '../../services/trialTask.service.js';
import { messageService } from '../../services/message.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDate } from '../../utils/format.js';

export default function VADetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [va, setVa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [hireOpen, setHireOpen] = useState(false);
  const [hireValues, setHireValues] = useState({ message: '', rate: '', startDate: '', hoursPerWeek: 40 });
  const [hiring, setHiring] = useState(false);

  const [trialOpen, setTrialOpen] = useState(false);
  const [trialValues, setTrialValues] = useState({
    title: '',
    brief: '',
    deadline: '',
    compensation: ''
  });
  const [trialSubmitting, setTrialSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await vaService.getById(id);
      setVa(res?.va || res);
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

  const onShortlist = async () => {
    try {
      await shortlistService.add({ vaId: id });
      toast.success('Added to shortlist');
    } catch (err) {
      toast.error(err.message || 'Could not add to shortlist');
    }
  };

  const onMessage = async () => {
    try {
      const res = await messageService.startConversation({ vaId: id });
      const conv = res?.conversation || res;
      if (conv?._id) navigate(`/client/messages/${conv._id}`);
    } catch (err) {
      toast.error(err.message || 'Could not start conversation');
    }
  };

  const onHire = async (e) => {
    e.preventDefault();
    setHiring(true);
    try {
      await hiringService.create({
        vaId: id,
        message: hireValues.message,
        proposedRate: Number(hireValues.rate) || undefined,
        startDate: hireValues.startDate || undefined,
        hoursPerWeek: Number(hireValues.hoursPerWeek) || undefined
      });
      toast.success('Hiring request sent');
      setHireOpen(false);
      navigate('/client/hiring');
    } catch (err) {
      toast.error(err.message || 'Could not send hiring request');
    } finally {
      setHiring(false);
    }
  };

  const onCreateTrial = async (e) => {
    e.preventDefault();
    if (!trialValues.title.trim() || !trialValues.brief.trim() || !trialValues.deadline) {
      toast.error('Fill all required fields');
      return;
    }
    setTrialSubmitting(true);
    try {
      await trialTaskService.create({
        vaId: id,
        title: trialValues.title,
        brief: trialValues.brief,
        deadline: trialValues.deadline,
        compensation: Number(trialValues.compensation) || 0
      });
      toast.success('Trial task created');
      setTrialOpen(false);
      navigate('/client/trial-tasks');
    } catch (err) {
      toast.error(err.message || 'Could not create trial task');
    } finally {
      setTrialSubmitting(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;
  if (error) return <ErrorState message={error.message} onRetry={load} />;
  if (!va) return <EmptyState title="VA not found" />;

  const user = va.user || {};
  const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'VA';

  return (
    <div>
      <div className="mb-4">
        <Link to="/client/find-vas" className="text-sm text-ink-500 hover:text-ink-800">
          ← Back to VAs
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardBody>
              <div className="flex items-start gap-4">
                <Avatar src={user.avatarUrl} name={name} size="xl" />
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl font-bold text-ink-900">{name}</h1>
                  <p className="text-ink-600 mt-1">{va.headline || 'E-commerce VA'}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-ink-500">
                    <span>📍 {va.country || '—'}</span>
                    <span>🕒 {va.timezone || '—'}</span>
                    <span>💼 {va.yearsExperience || 0} yrs</span>
                    {va.verificationStatus === 'verified' && (
                      <span className="text-emerald-700 font-medium">✓ Verified</span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ScoreBadge score={va.performance?.overallScore} label="Performance" />
                    {va.assessmentAverage != null && (
                      <ScoreBadge score={va.assessmentAverage} label="Assessments" />
                    )}
                    {va.practicalAverage != null && (
                      <ScoreBadge score={va.practicalAverage} label="Practical" />
                    )}
                  </div>
                </div>
              </div>
              {va.bio && (
                <div className="mt-5 text-sm text-ink-700 whitespace-pre-line">{va.bio}</div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Verified skills" />
            <CardBody>
              {(va.skills || []).length === 0 ? (
                <p className="text-sm text-ink-500">No skills listed.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {va.skills.map((s, i) => (
                    <div key={i} className="border border-ink-100 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-ink-900">
                          {s.name || s.skill?.name}
                        </div>
                        {typeof s.score === 'number' && (
                          <span className="text-xs font-semibold text-brand-700">{s.score}/100</span>
                        )}
                      </div>
                      {s.platform && (
                        <div className="text-xs text-ink-500 mt-1 capitalize">{s.platform}</div>
                      )}
                      {s.yearsExperience != null && (
                        <div className="text-xs text-ink-500 mt-1">
                          {s.yearsExperience} years experience
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Performance" />
            <CardBody>
              {va.performance ? (
                <div className="space-y-3">
                  <MatchBar score={va.performance.overallScore || 0} label="Overall" />
                  <MatchBar score={va.performance.taskCompletionRate || 0} label="Completion rate" />
                  <MatchBar score={va.performance.onTimeRate || 0} label="On-time rate" />
                  <MatchBar score={(va.performance.clientRating || 0) * 20} label="Client rating (avg)" />
                </div>
              ) : (
                <p className="text-sm text-ink-500">No performance data yet.</p>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardBody>
              <div className="text-sm text-ink-500">Hourly rate</div>
              <div className="mt-1 text-2xl font-bold text-ink-900">
                {va.hourlyRate ? `$${va.hourlyRate}/hr` : '—'}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Button onClick={() => setHireOpen(true)}>Send hiring request</Button>
                <Button variant="secondary" onClick={() => setTrialOpen(true)}>
                  Create trial task
                </Button>
                <Button variant="secondary" onClick={onShortlist}>Add to shortlist</Button>
                <Button variant="ghost" onClick={onMessage}>Message</Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="font-semibold text-ink-900 mb-3">Availability</div>
              <div className="text-sm text-ink-600">{va.availability || 'Not specified'}</div>
              {va.languages?.length > 0 && (
                <>
                  <div className="font-semibold text-ink-900 mt-4 mb-2">Languages</div>
                  <div className="flex flex-wrap gap-2">
                    {va.languages.map((l) => (
                      <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-ink-100 text-ink-700">
                        {l}
                      </span>
                    ))}
                  </div>
                </>
              )}
              <div className="font-semibold text-ink-900 mt-4 mb-2">Member since</div>
              <div className="text-sm text-ink-600">{formatDate(user.createdAt)}</div>
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        open={hireOpen}
        onClose={() => setHireOpen(false)}
        title="Send hiring request"
        footer={
          <>
            <Button variant="secondary" onClick={() => setHireOpen(false)}>Cancel</Button>
            <Button onClick={onHire} loading={hiring}>Send request</Button>
          </>
        }
      >
        <form onSubmit={onHire} className="space-y-4">
          <Textarea
            label="Message"
            rows={4}
            value={hireValues.message}
            onChange={(e) => setHireValues((v) => ({ ...v, message: e.target.value }))}
            placeholder="Introduce yourself and describe the role."
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Proposed hourly rate"
              type="number"
              value={hireValues.rate}
              onChange={(e) => setHireValues((v) => ({ ...v, rate: e.target.value }))}
            />
            <Input
              label="Hours / week"
              type="number"
              value={hireValues.hoursPerWeek}
              onChange={(e) => setHireValues((v) => ({ ...v, hoursPerWeek: e.target.value }))}
            />
          </div>
          <Input
            label="Proposed start date"
            type="date"
            value={hireValues.startDate}
            onChange={(e) => setHireValues((v) => ({ ...v, startDate: e.target.value }))}
          />
        </form>
      </Modal>

      <Modal
        open={trialOpen}
        onClose={() => setTrialOpen(false)}
        title="Create trial task"
        footer={
          <>
            <Button variant="secondary" onClick={() => setTrialOpen(false)}>Cancel</Button>
            <Button onClick={onCreateTrial} loading={trialSubmitting}>Create</Button>
          </>
        }
      >
        <form onSubmit={onCreateTrial} className="space-y-4">
          <Input
            label="Title"
            value={trialValues.title}
            onChange={(e) => setTrialValues((v) => ({ ...v, title: e.target.value }))}
            required
          />
          <Textarea
            label="Brief"
            rows={5}
            value={trialValues.brief}
            onChange={(e) => setTrialValues((v) => ({ ...v, brief: e.target.value }))}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Deadline"
              type="datetime-local"
              value={trialValues.deadline}
              onChange={(e) => setTrialValues((v) => ({ ...v, deadline: e.target.value }))}
              required
            />
            <Input
              label="Compensation (USD)"
              type="number"
              value={trialValues.compensation}
              onChange={(e) => setTrialValues((v) => ({ ...v, compensation: e.target.value }))}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}