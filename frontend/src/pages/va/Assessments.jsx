import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody, CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import ScoreBadge from '../../components/common/ScoreBadge.jsx';
import { assessmentService } from '../../services/assessment.service.js';
import { formatDate } from '../../utils/format.js';

export default function Assessments() {
  const [available, setAvailable] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [a, r] = await Promise.all([
        assessmentService.list({}),
        assessmentService.myResults()
      ]);
      setAvailable(a?.items || a || []);
      setResults(r?.items || r || []);
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

  const resultsByAssessment = new Map();
  results.forEach((r) => {
    const key = r.assessment?._id || r.assessmentId || r.assessment;
    if (key) resultsByAssessment.set(String(key), r);
  });

  return (
    <div>
      <PageHeader
        title="Assessments"
        subtitle="Pass e-commerce skill assessments to earn Verified Skill scores."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Available assessments" />
            <CardBody>
              {available.length === 0 ? (
                <EmptyState
                  icon="🧠"
                  title="No assessments available"
                  description="Assessments will appear here when published by the admin."
                />
              ) : (
                <ul className="divide-y divide-ink-100">
                  {available.map((a) => {
                    const result = resultsByAssessment.get(String(a._id));
                    return (
                      <li key={a._id} className="py-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-ink-900">{a.title}</span>
                              {a.difficulty && (
                                <Badge tone="neutral">{a.difficulty}</Badge>
                              )}
                            </div>
                            {a.description && (
                              <p className="text-sm text-ink-500 mt-1">{a.description}</p>
                            )}
                            <div className="text-xs text-ink-400 mt-1">
                              {a.questionsCount || a.questionCount || 0} questions
                              {a.durationMinutes ? ` · ${a.durationMinutes} min` : ''}
                            </div>
                            {result && (
                              <div className="mt-2 flex items-center gap-2">
                                <ScoreBadge score={result.score} label="Your score" />
                                <span className="text-xs text-ink-500">
                                  {formatDate(result.createdAt)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="shrink-0">
                            <Button
                              size="sm"
                              to={`/va/assessments/${a._id}`}
                              variant={result ? 'secondary' : 'primary'}
                            >
                              {result ? 'Retake' : 'Start'}
                            </Button>
                          </div>
                        </div>
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
            <CardHeader title="Your results" />
            <CardBody>
              {results.length === 0 ? (
                <p className="text-sm text-ink-500">You haven't completed any assessments yet.</p>
              ) : (
                <ul className="space-y-3">
                  {results.map((r) => (
                    <li key={r._id} className="border border-ink-100 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-ink-900 text-sm">
                          {r.assessment?.title || 'Assessment'}
                        </div>
                        <ScoreBadge score={r.score} />
                      </div>
                      <div className="text-xs text-ink-500 mt-1">{formatDate(r.createdAt)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}