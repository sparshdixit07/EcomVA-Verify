import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { vaService } from '../../services/va.service.js';
import Avatar from '../../components/ui/Avatar.jsx';
import ScoreBadge from '../../components/common/ScoreBadge.jsx';
import Button from '../../components/ui/Button.jsx';
import Card, { CardBody, CardHeader } from '../../components/ui/Card.jsx';
import { Spinner } from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { formatDate } from '../../utils/format.js';
import { reviewService } from '../../services/review.service.js';

export default function PublicVAProfile() {
  const { id } = useParams();
  const [va, setVa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vaService.getById(id);
      setVa(data?.va || data);
      try {
        const r = await reviewService.listForVA(id, { limit: 5 });
        setReviews(r?.items || []);
      } catch {
        setReviews([]);
      }
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

  if (loading) {
    return (
      <div className="container-page py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-page py-20">
        <ErrorState message={error.message} onRetry={load} />
      </div>
    );
  }

  if (!va) {
    return (
      <div className="container-page py-20">
        <EmptyState title="VA not found" />
      </div>
    );
  }

  const user = va.user || {};
  const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'VA';

  return (
    <div className="container-page py-12 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardBody>
            <div className="flex items-start gap-4">
              <Avatar src={user.avatarUrl} name={name} size="xl" />
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-ink-900">{name}</h1>
                <p className="text-ink-600 mt-1">{va.headline || 'E-commerce Virtual Assistant'}</p>
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
          <CardHeader title="Verified e-commerce skills" />
          <CardBody>
            {(va.skills || []).length === 0 ? (
              <p className="text-sm text-ink-500">No skills listed yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {va.skills.map((s) => (
                  <div key={s._id || s.name} className="border border-ink-100 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-ink-900">
                        {s.name || s.skill?.name}
                      </div>
                      {typeof s.score === 'number' && (
                        <span className="text-xs font-semibold text-brand-700">
                          {s.score}/100
                        </span>
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
          <CardHeader title="Recent reviews" />
          <CardBody>
            {reviews.length === 0 ? (
              <p className="text-sm text-ink-500">No reviews yet.</p>
            ) : (
              <ul className="space-y-4">
                {reviews.map((r) => (
                  <li key={r._id} className="border border-ink-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-ink-900">
                        {r.client?.firstName} {r.client?.lastName}
                      </div>
                      <div className="text-amber-500 text-sm">
                        {'★'.repeat(r.rating || 0)}
                        <span className="text-ink-300">{'★'.repeat(5 - (r.rating || 0))}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-ink-700">{r.comment}</p>
                    <div className="mt-2 text-xs text-ink-400">{formatDate(r.createdAt)}</div>
                  </li>
                ))}
              </ul>
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
              <Button to="/login" className="w-full">
                Sign in to hire
              </Button>
              <Button variant="secondary" to="/register" className="w-full">
                Create account
              </Button>
            </div>
            <p className="mt-4 text-xs text-ink-500">
              You need an account to shortlist, compare, run a trial task, or send a hiring request.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-sm font-semibold text-ink-900 mb-3">Availability</div>
            <div className="text-sm text-ink-600">
              {va.availability || 'Not specified'}
            </div>
            {va.languages && va.languages.length > 0 && (
              <>
                <div className="text-sm font-semibold text-ink-900 mt-4 mb-2">Languages</div>
                <div className="flex flex-wrap gap-2">
                  {va.languages.map((l) => (
                    <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-ink-100 text-ink-700">
                      {l}
                    </span>
                  ))}
                </div>
              </>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-sm text-ink-500">Browse more</div>
            <Link to="/find-vas" className="link mt-2 inline-block">
              ← Back to directory
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}