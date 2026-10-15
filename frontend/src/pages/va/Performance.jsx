import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody, CardHeader } from '../../components/ui/Card.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import MatchBar from '../../components/common/MatchBar.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { performanceService } from '../../services/performance.service.js';
import { formatDate } from '../../utils/format.js';

export default function Performance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await performanceService.myPerformance();
      setData(res?.performance || res);
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

  const p = data || {};

  return (
    <div>
      <PageHeader
        title="Performance"
        subtitle="Your track record across all engagements."
        action={<span className="text-sm text-ink-500">Last updated {formatDate(p.updatedAt) || '—'}</span>}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Tasks completed" value={p.tasksCompleted ?? 0} icon="✅" tone="success" />
        <StatCard
          label="Completion rate"
          value={p.taskCompletionRate != null ? `${Math.round(p.taskCompletionRate)}%` : '—'}
          icon="📊"
        />
        <StatCard
          label="On-time rate"
          value={p.onTimeRate != null ? `${Math.round(p.onTimeRate)}%` : '—'}
          icon="⏱️"
          tone="info"
        />
        <StatCard
          label="Overall score"
          value={p.overallScore != null ? `${Math.round(p.overallScore)}/100` : '—'}
          icon="📈"
          tone="brand"
        />
      </div>

      {!p || Object.keys(p).length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="📈"
              title="No performance data yet"
              description="Complete tasks in active engagements to build your performance record."
            />
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader title="Breakdown" />
          <CardBody>
            <div className="grid sm:grid-cols-2 gap-4">
              <MatchBar score={p.taskCompletionRate || 0} label="Completion rate" />
              <MatchBar score={p.onTimeRate || 0} label="On-time rate" />
              <MatchBar score={p.accuracy || 0} label="Accuracy" />
              <MatchBar score={(p.clientRating || 0) * 20} label="Client rating" />
              <MatchBar score={p.responsiveness || 0} label="Responsiveness" />
              <MatchBar score={p.overallScore || 0} label="Overall" />
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}