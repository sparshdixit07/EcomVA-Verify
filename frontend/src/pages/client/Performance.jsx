import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody, CardHeader } from '../../components/ui/Card.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import MatchBar from '../../components/common/MatchBar.jsx';
import { engagementService } from '../../services/engagement.service.js';
import { performanceService } from '../../services/performance.service.js';

export default function Performance() {
  const [engagements, setEngagements] = useState([]);
  const [performanceByEng, setPerformanceByEng] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await engagementService.listMine({ limit: 50 });
      const items = res?.items || [];
      setEngagements(items);
      const map = {};
      await Promise.all(
        items.map(async (e) => {
          try {
            const p = await performanceService.forEngagement(e._id);
            map[e._id] = p?.performance || p;
          } catch {
            map[e._id] = null;
          }
        })
      );
      setPerformanceByEng(map);
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

  const totals = engagements.reduce(
    (acc, e) => {
      const p = performanceByEng[e._id];
      if (!p) return acc;
      acc.tasks += p.tasksCompleted || 0;
      acc.onTime += p.onTimeRate || 0;
      acc.accuracy += p.accuracy || 0;
      acc.count += 1;
      return acc;
    },
    { tasks: 0, onTime: 0, accuracy: 0, count: 0 }
  );

  return (
    <div>
      <PageHeader title="Performance" subtitle="Aggregate performance across your engagements." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active engagements" value={engagements.length} icon="🤝" />
        <StatCard label="Tasks completed" value={totals.tasks} icon="✅" tone="success" />
        <StatCard
          label="Avg on-time"
          value={totals.count ? `${Math.round(totals.onTime / totals.count)}%` : '—'}
          icon="⏱️"
          tone="info"
        />
        <StatCard
          label="Avg accuracy"
          value={totals.count ? `${Math.round(totals.accuracy / totals.count)}%` : '—'}
          icon="🎯"
          tone="warning"
        />
      </div>

      <Card>
        <CardHeader title="Per engagement" />
        <CardBody>
          {engagements.length === 0 ? (
            <EmptyState
              icon="📈"
              title="No engagements yet"
              description="Performance data will appear after you hire and assign tasks."
              actionTo="/client/hiring"
              actionLabel="Go to hiring"
            />
          ) : (
            <ul className="space-y-4">
              {engagements.map((e) => {
                const p = performanceByEng[e._id];
                const vaUser = e.va?.user || {};
                const vaName = `${vaUser.firstName || ''} ${vaUser.lastName || ''}`.trim() || 'VA';
                return (
                  <li key={e._id} className="border border-ink-100 rounded-xl p-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <div className="font-medium text-ink-900">{e.title || `Engagement with ${vaName}`}</div>
                        <div className="text-xs text-ink-500">{vaName}</div>
                      </div>
                      <div className="text-sm text-ink-500">
                        {p ? `Overall: ${Math.round(p.overallScore || 0)}/100` : 'No data yet'}
                      </div>
                    </div>
                    {p && (
                      <div className="mt-3 grid sm:grid-cols-2 gap-3">
                        <MatchBar score={p.taskCompletionRate || 0} label="Completion" />
                        <MatchBar score={p.onTimeRate || 0} label="On-time" />
                        <MatchBar score={p.accuracy || 0} label="Accuracy" />
                        <MatchBar score={(p.clientRating || 0) * 20} label="Client rating" />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}