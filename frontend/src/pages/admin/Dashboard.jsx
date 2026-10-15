import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Card, { CardBody, CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import { adminService } from '../../services/admin.service.js';
import { verificationService } from '../../services/verification.service.js';
import { formatRelative, titleCase } from '../../utils/format.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, v, l] = await Promise.all([
        adminService.dashboard(),
        verificationService.list({ status: 'pending', limit: 5 }).catch(() => ({ items: [] })),
        adminService.listAuditLogs({ limit: 8 }).catch(() => ({ items: [] }))
      ]);
      setStats(s?.stats || s);
      setPendingVerifications(v?.items || []);
      setRecentLogs(l?.items || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;
  if (error) return <ErrorState message={error.message} onRetry={load} />;

  const s = stats || {};

  return (
    <div>
      <PageHeader
        title="Admin dashboard"
        subtitle="Platform overview and moderation queue."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" to="/admin/verification">Verification queue</Button>
            <Button to="/admin/users">Manage users</Button>
          </div>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total users" value={s.totalUsers ?? 0} icon="👥" tone="brand" />
        <StatCard label="Clients" value={s.totalClients ?? 0} icon="🏢" tone="info" />
        <StatCard label="VAs" value={s.totalVAs ?? 0} icon="🧑‍💻" tone="success" />
        <StatCard
          label="Pending verifications"
          value={s.pendingVerifications ?? 0}
          icon="🛡️"
          tone="warning"
        />
        <StatCard label="Active engagements" value={s.activeEngagements ?? 0} icon="🤝" tone="success" />
        <StatCard label="Open reports" value={s.openReports ?? 0} icon="🚩" tone="danger" />
        <StatCard label="Suspended users" value={s.suspendedUsers ?? 0} icon="⛔" tone="danger" />
        <StatCard label="Trial tasks" value={s.totalTrialTasks ?? 0} icon="🧪" tone="neutral" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Pending verifications"
              action={
                <Link to="/admin/verification" className="link text-sm">
                  View all →
                </Link>
              }
            />
            <CardBody>
              {pendingVerifications.length === 0 ? (
                <p className="text-sm text-ink-500">No pending verification requests.</p>
              ) : (
                <ul className="divide-y divide-ink-100">
                  {pendingVerifications.map((v) => {
                    const vaUser = v.va?.user || {};
                    const name =
                      `${vaUser.firstName || ''} ${vaUser.lastName || ''}`.trim() || 'VA';
                    return (
                      <li key={v._id} className="py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium text-ink-900 truncate">{name}</div>
                          <div className="text-xs text-ink-500">
                            Requested {formatRelative(v.createdAt)}
                          </div>
                        </div>
                        <Link to="/admin/verification" className="link text-sm">
                          Review →
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Recent admin actions"
              action={
                <Link to="/admin/audit-logs" className="link text-sm">
                  All logs →
                </Link>
              }
            />
            <CardBody>
              {recentLogs.length === 0 ? (
                <p className="text-sm text-ink-500">No audit entries yet.</p>
              ) : (
                <ul className="divide-y divide-ink-100">
                  {recentLogs.map((log) => (
                    <li key={log._id} className="py-3 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-ink-900">
                          {log.action} {log.targetType ? `· ${log.targetType}` : ''}
                        </div>
                        <div className="text-xs text-ink-500 mt-0.5">
                          {log.actorEmail || log.actor?.email || 'system'} · {formatRelative(log.createdAt)}
                        </div>
                      </div>
                      <Badge tone="neutral">{titleCase(log.severity || 'info')}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Quick actions" />
            <CardBody>
              <div className="flex flex-col gap-2">
                <Button variant="secondary" to="/admin/verification">Verification queue</Button>
                <Button variant="secondary" to="/admin/assessments">Manage assessments</Button>
                <Button variant="secondary" to="/admin/hiring">Hiring monitor</Button>
                <Button variant="secondary" to="/admin/reports">Open reports</Button>
                <Button variant="secondary" to="/admin/suspensions">Suspensions</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}