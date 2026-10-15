import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { vaService } from '../../services/va.service.js';
import { reviewService } from '../../services/review.service.js';
import { formatDate } from '../../utils/format.js';

export default function Reviews() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avg, setAvg] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await vaService.getProfile();
      const profile = p?.profile || p;
      const vaId = profile?._id;
      if (!vaId) {
        setItems([]);
        return;
      }
      const res = await reviewService.listForVA(vaId, { limit: 50 });
      setItems(res?.items || []);
      if (typeof res?.averageRating === 'number') setAvg(res.averageRating);
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

  return (
    <div>
      <PageHeader
        title="Reviews"
        subtitle="What clients say about your work."
        action={
          avg != null ? (
            <span className="text-sm text-ink-600">
              Average: <span className="font-semibold">{avg.toFixed(1)} / 5</span>
            </span>
          ) : null
        }
      />

      {items.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="💬"
              title="No reviews yet"
              description="You'll receive reviews after completing an engagement."
            />
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((r) => {
            const clientUser = r.client?.user || r.client || {};
            const clientName =
              r.client?.companyName ||
              `${clientUser.firstName || ''} ${clientUser.lastName || ''}`.trim() ||
              'Client';
            return (
              <Card key={r._id}>
                <CardBody>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-ink-900">{clientName}</div>
                      <div className="text-xs text-ink-500 mt-0.5">
                        {formatDate(r.createdAt)}
                      </div>
                    </div>
                    <div className="text-amber-500">{'★'.repeat(r.rating || 0)}</div>
                  </div>
                  <p className="mt-2 text-sm text-ink-700">{r.comment}</p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}