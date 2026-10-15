import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import ScoreBadge from '../../components/common/ScoreBadge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import { shortlistService } from '../../services/shortlist.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { setCompareIds } from './FindVAs.jsx';

export default function Shortlist() {
  const toast = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [confirm, setConfirm] = useState({ open: false, id: null, loading: false });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await shortlistService.list();
      setItems(res?.items || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleSelect = (vaId) => {
    setSelected((prev) => {
      if (prev.includes(vaId)) return prev.filter((x) => x !== vaId);
      if (prev.length >= 3) {
        toast.warning('Max 3 for comparison');
        return prev;
      }
      return [...prev, vaId];
    });
  };

  const startCompare = () => {
    if (selected.length < 2) {
      toast.warning('Select at least 2 VAs');
      return;
    }
    setCompareIds(selected);
    navigate('/client/compare');
  };

  const onRemove = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await shortlistService.remove(confirm.id);
      toast.success('Removed');
      setConfirm({ open: false, id: null, loading: false });
      load();
    } catch (err) {
      toast.error(err.message || 'Could not remove');
      setConfirm((c) => ({ ...c, loading: false }));
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;
  if (error) return <ErrorState message={error.message} onRetry={load} />;

  return (
    <div>
      <PageHeader
        title="Shortlist"
        subtitle="Your saved VA candidates."
        action={
          <Button onClick={startCompare} disabled={selected.length < 2}>
            Compare selected ({selected.length})
          </Button>
        }
      />

      {items.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="⭐"
              title="No shortlisted VAs"
              description="Save VAs you're considering by clicking the star on their card."
              actionTo="/client/find-vas"
              actionLabel="Find VAs"
            />
          </CardBody>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((entry) => {
            const va = entry.va || entry;
            const user = va.user || {};
            const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'VA';
            const isSelected = selected.includes(va._id);
            return (
              <Card key={entry._id || va._id}>
                <CardBody>
                  <div className="flex items-start gap-3">
                    <Avatar src={user.avatarUrl} name={name} size="lg" />
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/client/vas/${va._id}`}
                        className="font-semibold text-ink-900 hover:text-brand-700 truncate block"
                      >
                        {name}
                      </Link>
                      <div className="text-sm text-ink-500 line-clamp-2">
                        {va.headline || 'E-commerce VA'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(va._id)}
                      className="h-4 w-4 rounded border-ink-300"
                      aria-label="Select for compare"
                    />
                  </div>
                  <div className="mt-3">
                    <ScoreBadge score={va.performance?.overallScore} label="Perf" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" to={`/client/vas/${va._id}`} className="flex-1">View</Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setConfirm({ open: true, id: entry._id, loading: false })}
                    >
                      Remove
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null, loading: false })}
        onConfirm={onRemove}
        title="Remove from shortlist?"
        message="This will remove the VA from your shortlist."
        confirmText="Remove"
        loading={confirm.loading}
      />
    </div>
  );
}