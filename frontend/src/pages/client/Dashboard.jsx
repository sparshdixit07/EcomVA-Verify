import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Card, { CardBody, CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { Spinner } from '../../components/ui/Spinner.jsx';
import { clientService } from '../../services/client.service.js';
import { formatDate, formatRelative, titleCase } from '../../utils/format.js';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await clientService.getDashboard();
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
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={load} />;
  }

  const stats = data?.stats || {};
  const recentRequirements = data?.recentRequirements || [];
  const activeEngagements = data?.activeEngagements || [];
  const pendingActions = data?.pendingActions || [];

  return (
    <div>
      <PageHeader
        title="Client dashboard"
        subtitle="Overview of your hiring pipeline and active work."
        action={<Button to="/client/requirements/new">+ New requirement</Button>}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open requirements" value={stats.openRequirements ?? 0} tone="brand" icon="📋" />
        <StatCard label="Shortlisted VAs" value={stats.shortlisted ?? 0} tone="info" icon="⭐" />
        <StatCard label="Active engagements" value={stats.activeEngagements ?? 0} tone="success" icon="🤝" />
        <StatCard label="Trial tasks pending" value={stats.pendingTrials ?? 0} tone="warning" icon="🧪" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Recent requirements"
              action={<Link to="/client/requirements" className="link text-sm">View all</Link>}
            />
            <CardBody>
              {recentRequirements.length === 0 ? (
                <EmptyState
                  icon="📋"
                  title="No requirements yet"
                  description="Post your first requirement to see matched VAs."
                  actionTo="/client/requirements/new"
                  actionLabel="Create requirement"
                />
              ) : (
                <ul className="divide-y divide-ink-100">
                  {recentRequirements.map((r) => (
                    <li key={r._id} className="py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <Link to={`/client/requirements/${r._id}`} className="font-medium text-ink-900 hover:text-brand-700 truncate block">
                          {r.title}
                        </Link>
                        <div className="text-xs text-ink-500 mt-0.5">
                          {titleCase(r.platform)} · {r.status} · {formatDate(r.createdAt)}
                        </div>
                      </div>
                      <Link to={`/client/requirements/${r._id}`} className="link text-sm shrink-0">
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
              action={<Link to="/client/hiring" className="link text-sm">View all</Link>}
            />
            <CardBody>
              {activeEngagements.length === 0 ? (
                <p className="text-sm text-ink-500">No active engagements yet.</p>
              ) : (
                <ul className="divide-y divide-ink-100">
                  {activeEngagements.map((e) => {
                    const vaUser = e.va?.user || {};
                    const name = `${vaUser.firstName || ''} ${vaUser.lastName || ''}`.trim() || 'VA';
                    return (
                      <li key={e._id} className="py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <Link to={`/client/engagements/${e._id}`} className="font-medium text-ink-900 hover:text-brand-700 truncate block">
                            {e.title || `Engagement with ${name}`}
                          </Link>
                          <div className="text-xs text-ink-500 mt-0.5">
                            {name} · {e.status} · started {formatRelative(e.createdAt)}
                          </div>
                        </div>
                        <Link to={`/client/engagements/${e._id}`} className="link text-sm shrink-0">
                          Open
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Pending actions" />
            <CardBody>
              {pendingActions.length === 0 ? (
                <p className="text-sm text-ink-500">You're all caught up.</p>
              ) : (
                <ul className="space-y-3">
                  {pendingActions.map((a, i) => (
                    <li key={i} className="text-sm">
                      <Link to={a.to || '#'} className="flex items-start gap-2 hover:bg-ink-50 rounded-lg p-2 -m-2">
                        <span className="text-lg">{a.icon || '•'}</span>
                        <div>
                          <div className="font-medium text-ink-900">{a.title}</div>
                          <div className="text-xs text-ink-500">{a.description}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Quick links" />
            <CardBody>
              <div className="flex flex-col gap-2">
                <Button variant="secondary" to="/client/find-vas">Browse VAs</Button>
                <Button variant="secondary" to="/client/compare">Compare VAs</Button>
                <Button variant="secondary" to="/client/trial-tasks">Trial tasks</Button>
                <Button variant="secondary" to="/client/messages">Messages</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}