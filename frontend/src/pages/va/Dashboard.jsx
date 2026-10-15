import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Card, { CardBody, CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import { vaService } from '../../services/va.service.js';
import { formatRelative, titleCase } from '../../utils/format.js';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await vaService.getDashboard();
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;
  }

  if (error) return <ErrorState message={error.message} onRetry={load} />;

  const stats = data?.stats || {};
  const pendingTrials = data?.pendingTrials || [];
  const activeEngagements = data?.activeEngagements || [];
  const recentNotifications = data?.recentNotifications || [];
  const profile = data?.profile || {};

  return (
    <div>
      <PageHeader
        title="VA dashboard"
        subtitle="Your profile, assessments, tasks and performance at a glance."
        action={
          <div className="flex gap-2">
            <Button to="/va/profile" variant="secondary">Edit profile</Button>
            <Button to="/va/assessments">Take assessment</Button>
          </div>
        }
      />

      {profile.verificationStatus !== 'verified' && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="text-2xl">🛡️</div>
          <div className="flex-1">
            <div className="font-semibold text-amber-900">Complete your verification</div>
            <div className="text-sm text-amber-800">
              Verified VAs appear higher in search and are more likely to be hired.
            </div>
          </div>
          <Button to="/va/verification" size="sm">Go to verification</Button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Assessments passed"
          value={stats.assessmentsPassed ?? 0}
          icon="🧠"
          tone="brand"
        />
        <StatCard
          label="Trial tasks pending"
          value={stats.pendingTrials ?? 0}
          icon="🧪"
          tone="warning"
        />
        <StatCard
          label="Active engagements"
          value={stats.activeEngagements ?? 0}
          icon="🤝"
          tone="success"
        />
        <StatCard
          label="Overall score"
          value={profile.performance?.overallScore ? `${Math.round(profile.performance.overallScore)}/100` : '—'}
          icon="📈"
          tone="info"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Pending trial tasks"
              action={<Link to="/va/trial-tasks" className="link text-sm">View all</Link>}
            />
            <CardBody>
              {pendingTrials.length === 0 ? (
                <EmptyState
                  icon="🧪"
                  title="No pending trial tasks"
                  description="Clients will assign you trial tasks from your profile."
                />
              ) : (
                <ul className="divide-y divide-ink-100">
                  {pendingTrials.map((t) => (
                    <li key={t._id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to={`/va/trial-tasks/${t._id}`}
                          className="font-medium text-ink-900 hover:text-brand-700 truncate block"
                        >
                          {t.title}
                        </Link>
                        <div className="text-xs text-ink-500 mt-0.5">
                          <Badge tone={statusTone(t.status)}>{titleCase(t.status)}</Badge>
                          <span className="ml-2">{formatRelative(t.createdAt)}</span>
                        </div>
                      </div>
                      <Link to={`/va/trial-tasks/${t._id}`} className="link text-sm shrink-0">
                        Open
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Active engagements"
              action={<Link to="/va/hiring" className="link text-sm">View all</Link>}
            />
            <CardBody>
              {activeEngagements.length === 0 ? (
                <p className="text-sm text-ink-500">No active engagements yet.</p>
              ) : (
                <ul className="divide-y divide-ink-100">
                  {activeEngagements.map((e) => (
                    <li key={e._id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to={`/va/engagements/${e._id}`}
                          className="font-medium text-ink-900 hover:text-brand-700 truncate block"
                        >
                          {e.title || 'Engagement'}
                        </Link>
                        <div className="text-xs text-ink-500 mt-0.5">
                          <Badge tone={statusTone(e.status)}>{titleCase(e.status)}</Badge>
                          <span className="ml-2">
                            {e.client?.companyName || e.client?.user?.firstName || 'Client'}
                          </span>
                        </div>
                      </div>
                      <Link to={`/va/engagements/${e._id}`} className="link text-sm shrink-0">
                        Open
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Recent notifications" />
            <CardBody>
              {recentNotifications.length === 0 ? (
                <p className="text-sm text-ink-500">Nothing new.</p>
              ) : (
                <ul className="space-y-3">
                  {recentNotifications.map((n) => (
                    <li key={n._id} className="text-sm">
                      <div className="font-medium text-ink-900">{n.title}</div>
                      <div className="text-xs text-ink-500">{formatRelative(n.createdAt)}</div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4">
                <Button variant="secondary" size="sm" to="/va/notifications" className="w-full">
                  All notifications
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Quick links" />
            <CardBody>
              <div className="flex flex-col gap-2">
                <Button variant="secondary" to="/va/skills">Manage skills</Button>
                <Button variant="secondary" to="/va/assessments">Assessments</Button>
                <Button variant="secondary" to="/va/tasks">My tasks</Button>
                <Button variant="secondary" to="/va/messages">Messages</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}