import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import ScoreBadge from '../../components/common/ScoreBadge.jsx';
import MatchBar from '../../components/common/MatchBar.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { vaService } from '../../services/va.service.js';
import { shortlistService } from '../../services/shortlist.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { getCompareIds, setCompareIds } from './FindVAs.jsx';

export default function Compare() {
  const navigate = useNavigate();
  const toast = useToast();
  const [ids] = useState(getCompareIds());
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        ids.map((id) => vaService.getById(id).then((r) => r?.va || r))
      );
      setItems(results.filter(Boolean));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = (id) => {
    const next = ids.filter((x) => x !== id);
    setCompareIds(next);
    setItems((prev) => prev.filter((v) => v._id !== id));
    if (next.length === 0) navigate('/client/find-vas');
  };

  const shortlist = async (id) => {
    try {
      await shortlistService.add({ vaId: id });
      toast.success('Added to shortlist');
    } catch (err) {
      toast.error(err.message || 'Could not add');
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;
  if (error) return <ErrorState message={error.message} onRetry={load} />;

  if (ids.length === 0 || items.length === 0) {
    return (
      <div>
        <PageHeader title="Compare VAs" subtitle="Pick 2–3 VAs to compare side-by-side." />
        <Card>
          <CardBody>
            <EmptyState
              icon="⚖️"
              title="No VAs selected for comparison"
              description="Browse VAs and click the + button to add them to compare."
              actionTo="/client/find-vas"
              actionLabel="Find VAs"
            />
          </CardBody>
        </Card>
      </div>
    );
  }

  const rows = [
    { label: 'Country', render: (va) => va.country || '—' },
    { label: 'Timezone', render: (va) => va.timezone || '—' },
    { label: 'Experience', render: (va) => `${va.yearsExperience || 0} yrs` },
    { label: 'Hourly rate', render: (va) => (va.hourlyRate ? `$${va.hourlyRate}/hr` : '—') },
    { label: 'English', render: (va) => va.englishLevel || '—' },
    { label: 'Verification', render: (va) => va.verificationStatus || 'unverified' },
    { label: 'Availability', render: (va) => va.availability || '—' },
    {
      label: 'Skills',
      render: (va) => (
        <div className="flex flex-wrap gap-1">
          {(va.skills || []).map((s, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-ink-100 text-ink-700">
              {s.name || s.skill?.name || 'Skill'}
            </span>
          ))}
        </div>
      )
    },
    {
      label: 'Performance',
      render: (va) => <ScoreBadge score={va.performance?.overallScore} label="Perf" />
    },
    {
      label: 'Assessments avg',
      render: (va) =>
        va.assessmentAverage != null ? (
          <ScoreBadge score={va.assessmentAverage} label="Assess" />
        ) : (
          '—'
        )
    },
    {
      label: 'Practical avg',
      render: (va) =>
        va.practicalAverage != null ? (
          <ScoreBadge score={va.practicalAverage} label="Practical" />
        ) : (
          '—'
        )
    },
    {
      label: 'Overall',
      render: (va) => (
        <MatchBar
          score={
            va.performance?.overallScore != null
              ? Math.round(
                  (va.assessmentAverage || 0) * 0.4 +
                    (va.practicalAverage || 0) * 0.3 +
                    (va.performance?.overallScore || 0) * 0.3
                )
              : 0
          }
          label="Composite"
        />
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Compare VAs"
        subtitle={`Comparing ${items.length} VA${items.length > 1 ? 's' : ''}.`}
        action={
          <Button variant="secondary" to="/client/find-vas">
            Add more
          </Button>
        }
      />

      <Card>
        <CardBody className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr>
                <th className="text-left text-sm font-semibold text-ink-500 py-3 pr-4 w-40">Attribute</th>
                {items.map((va) => {
                  const user = va.user || {};
                  const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'VA';
                  return (
                    <th key={va._id} className="text-left py-3 px-3 align-top">
                      <div className="flex flex-col items-start gap-2">
                        <Avatar src={user.avatarUrl} name={name} size="lg" />
                        <Link
                          to={`/client/vas/${va._id}`}
                          className="font-semibold text-ink-900 hover:text-brand-700"
                        >
                          {name}
                        </Link>
                        <div className="text-xs text-ink-500 line-clamp-2">
                          {va.headline || 'E-commerce VA'}
                        </div>
                        <div className="flex gap-2 mt-1">
                          <Button size="sm" to={`/client/vas/${va._id}`}>View</Button>
                          <Button size="sm" variant="secondary" onClick={() => shortlist(va._id)}>⭐</Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => remove(va._id)}
                            className="text-red-600"
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {rows.map((r) => (
                <tr key={r.label}>
                  <td className="py-3 pr-4 text-sm font-medium text-ink-600 align-top">{r.label}</td>
                  {items.map((va) => (
                    <td key={va._id} className="py-3 px-3 text-sm text-ink-800 align-top">
                      {r.render(va)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}