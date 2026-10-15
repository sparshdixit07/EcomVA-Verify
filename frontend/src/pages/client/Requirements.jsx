import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { Spinner } from '../../components/ui/Spinner.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import { requirementService } from '../../services/requirement.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDate, titleCase } from '../../utils/format.js';
import { usePagination } from '../../hooks/usePagination.js';

export default function Requirements() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null, loading: false });
  const { page, limit, total, totalPages, setPage, setTotal } = usePagination(1, 10);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await requirementService.mine({ page, limit });
      setItems(res?.items || []);
      setTotal(res?.total || 0);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onDelete = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await requirementService.remove(confirm.id);
      toast.success('Requirement deleted');
      setConfirm({ open: false, id: null, loading: false });
      load();
    } catch (err) {
      toast.error(err.message || 'Delete failed');
      setConfirm((c) => ({ ...c, loading: false }));
    }
  };

  return (
    <div>
      <PageHeader
        title="Requirements"
        subtitle="Your posted hiring requirements."
        action={<Button to="/client/requirements/new">+ New requirement</Button>}
      />

      {loading ? (
        <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
      ) : error ? (
        <ErrorState message={error.message} onRetry={load} />
      ) : items.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="📋"
              title="No requirements yet"
              description="Post your first requirement to start matching with VAs."
              actionTo="/client/requirements/new"
              actionLabel="Create requirement"
            />
          </CardBody>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((r) => (
              <Card key={r._id}>
                <CardBody>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Link to={`/client/requirements/${r._id}`} className="font-semibold text-ink-900 hover:text-brand-700">
                          {r.title}
                        </Link>
                        <Badge tone={statusTone(r.status)}>{titleCase(r.status)}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-ink-600 line-clamp-2">{r.description}</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-ink-500">
                        <span>Platform: {titleCase(r.platform)}</span>
                        <span>Budget: ${r.budgetMin || 0}–${r.budgetMax || 0}</span>
                        <span>Created: {formatDate(r.createdAt)}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {(r.requiredSkills || []).map((s, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-ink-100 text-ink-700">
                            {typeof s === 'string' ? s : s.name || s.skill?.name || 'Skill'}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                      <Button size="sm" to={`/client/requirements/${r._id}`}>Open</Button>
                      <Button size="sm" variant="secondary" to={`/client/requirements/${r._id}?edit=1`}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setConfirm({ open: true, id: r._id, loading: false })}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null, loading: false })}
        onConfirm={onDelete}
        title="Delete requirement?"
        message="This will remove the requirement and its matches. This action cannot be undone."
        confirmText="Delete"
        loading={confirm.loading}
      />
    </div>
  );
}