import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody, CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { verificationService } from '../../services/verification.service.js';
import { vaService } from '../../services/va.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDateTime, titleCase } from '../../utils/format.js';

export default function Verification() {
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await vaService.getProfile();
      setProfile(p?.profile || p);
      try {
        const v = await verificationService.myStatus();
        setVerification(v?.verification || v || null);
      } catch {
        setVerification(null);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRequest = async () => {
    setSubmitting(true);
    try {
      await vaService.requestVerification();
      toast.success('Verification request submitted');
      load();
    } catch (err) {
      toast.error(err.message || 'Could not submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;
  if (error) return <ErrorState message={error.message} onRetry={load} />;

  const status = profile?.verificationStatus || 'unverified';

  const requirements = [
    {
      label: 'Complete profile',
      done: !!(profile?.headline && profile?.bio && profile?.country && profile?.timezone)
    },
    {
      label: 'Add at least 2 skills',
      done: (profile?.skills || []).length >= 2
    },
    {
      label: 'Pass at least 1 assessment',
      done: (profile?.assessmentCount || 0) >= 1
    },
    {
      label: 'Complete a trial task',
      done: (profile?.trialTaskCount || 0) >= 1
    }
  ];

  const allDone = requirements.every((r) => r.done);

  return (
    <div>
      <PageHeader
        title="Verification"
        subtitle="Get verified to appear higher in searches and boost your match scores."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="text-sm text-ink-500">Current status</div>
                  <div className="mt-1">
                    <Badge tone={statusTone(status)}>{titleCase(status)}</Badge>
                  </div>
                </div>
                {status === 'unverified' && (
                  <Button onClick={onRequest} loading={submitting} disabled={!allDone}>
                    Request verification
                  </Button>
                )}
              </div>
              {!allDone && status === 'unverified' && (
                <p className="text-sm text-ink-500 mt-4">
                  Complete all requirements below before requesting verification.
                </p>
              )}
              {status === 'pending' && (
                <p className="text-sm text-ink-600 mt-4">
                  Your verification request is under review by our team.
                </p>
              )}
              {status === 'verified' && (
                <p className="text-sm text-emerald-700 mt-4">
                  You're verified. Great work!
                </p>
              )}
              {status === 'rejected' && verification?.reason && (
                <p className="text-sm text-red-700 mt-4">
                  Rejected: {verification.reason}
                </p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Requirements" />
            <CardBody>
              <ul className="space-y-3">
                {requirements.map((r) => (
                  <li key={r.label} className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-6 w-6 rounded-full items-center justify-center text-xs font-bold ${
                        r.done ? 'bg-emerald-100 text-emerald-700' : 'bg-ink-100 text-ink-500'
                      }`}
                    >
                      {r.done ? '✓' : '·'}
                    </span>
                    <span className={r.done ? 'text-ink-900' : 'text-ink-500'}>{r.label}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="How verification helps" />
            <CardBody>
              <ul className="space-y-3 text-sm text-ink-700">
                <li>✓ Higher position in search results</li>
                <li>✓ Better match scores in requirements</li>
                <li>✓ Verified badge on profile</li>
                <li>✓ Increased client trust</li>
              </ul>
            </CardBody>
          </Card>

          {verification?.createdAt && (
            <Card>
              <CardBody>
                <div className="text-xs text-ink-500">Requested on</div>
                <div className="text-sm text-ink-900">
                  {formatDateTime(verification.createdAt)}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}