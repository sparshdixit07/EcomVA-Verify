import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody, CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge, { statusTone } from '../../components/ui/Badge.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import MatchBar from '../../components/common/MatchBar.jsx';
import ScoreBadge from '../../components/common/ScoreBadge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { requirementService } from '../../services/requirement.service.js';
import { matchingService } from '../../services/matching.service.js';
import { shortlistService } from '../../services/shortlist.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDate, titleCase } from '../../utils/format.js';
import { ECOM_PLATFORMS, ENGLISH_LEVELS, TIMEZONES } from '../../utils/constants.js';
import { validateRequirement } from '../../utils/validators.js';

export default function RequirementDetail() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const editing = params.get('edit') === '1';
  const navigate = useNavigate();
  const toast = useToast();

  const [data, setData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('matches');
  const [editingValues, setEditingValues] = useState(null);
  const [saving, setSaving] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await requirementService.getById(id);
      setData(res?.requirement || res);
      setEditingValues({
        title: res.title,
        platform: res.platform,
        description: res.description,
        requiredSkills: (res.requiredSkills || []).map((s) => s._id || s),
        englishLevel: res.englishLevel || 'professional',
        timezone: res.timezone || '',
        availability: res.availability || 'full_time',
        budgetMin: res.budgetMin || 0,
        budgetMax: res.budgetMax || 0,
        budgetCurrency: res.budgetCurrency || 'USD',
        hoursPerWeek: res.hoursPerWeek || 40
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMatches = async () => {
    setMatchLoading(true);
    try {
      const res = await matchingService.matchForRequirement(id, { limit: 20 });
      setMatches(res?.items || res?.matches || []);
    } catch (err) {
      toast.error(err.message || 'Could not load matches');
      setMatches([]);
    } finally {
      setMatchLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (tab === 'matches' && matches.length === 0 && !matchLoading) {
      loadMatches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const onSave = async (e) => {
    e.preventDefault();
    const errs = validateRequirement(editingValues);
    if (Object.keys(errs).length) {
      toast.error('Please fix validation errors');
      return;
    }
    setSaving(true);
    try {
      await requirementService.update(id, editingValues);
      toast.success('Requirement updated');
      await load();
      navigate(`/client/requirements/${id}`, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const onShortlist = async (vaId) => {
    try {
      await shortlistService.add({ vaId, requirementId: id });
      toast.success('Added to shortlist');
    } catch (err) {
      toast.error(err.message || 'Could not add to shortlist');
    }
  };

  if (loading) {
    return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;
  }

  if (error) return <ErrorState message={error.message} onRetry={load} />;
  if (!data) return <EmptyState title="Requirement not found" />;

  return (
    <div>
      <div className="mb-4">
        <Link to="/client/requirements" className="text-sm text-ink-500 hover:text-ink-800">
          ← Back to requirements
        </Link>
      </div>

      <PageHeader
        title={data.title}
        subtitle={`Created ${formatDate(data.createdAt)}`}
        action={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              to={`/client/requirements/${id}?edit=${editing ? '0' : '1'}`}
            >
              {editing ? 'Cancel edit' : 'Edit'}
            </Button>
            <Button onClick={loadMatches}>Refresh matches</Button>
          </div>
        }
      />

      {editing ? (
        <form onSubmit={onSave} className="card p-6 space-y-4 max-w-3xl">
          <Input
            label="Title"
            value={editingValues.title}
            onChange={(e) => setEditingValues((v) => ({ ...v, title: e.target.value }))}
            required
          />
          <Select
            label="Platform"
            value={editingValues.platform}
            onChange={(e) => setEditingValues((v) => ({ ...v, platform: e.target.value }))}
          >
            {ECOM_PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
          <Textarea
            label="Description"
            rows={6}
            value={editingValues.description}
            onChange={(e) =>
              setEditingValues((v) => ({ ...v, description: e.target.value }))
            }
            required
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="English level"
              value={editingValues.englishLevel}
              onChange={(e) =>
                setEditingValues((v) => ({ ...v, englishLevel: e.target.value }))
              }
            >
              {ENGLISH_LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </Select>
            <Select
              label="Timezone"
              value={editingValues.timezone}
              onChange={(e) =>
                setEditingValues((v) => ({ ...v, timezone: e.target.value }))
              }
            >
              <option value="">Any</option>
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </Select>
            <Input
              label="Budget min"
              type="number"
              value={editingValues.budgetMin}
              onChange={(e) =>
                setEditingValues((v) => ({ ...v, budgetMin: e.target.value }))
              }
            />
            <Input
              label="Budget max"
              type="number"
              value={editingValues.budgetMax}
              onChange={(e) =>
                setEditingValues((v) => ({ ...v, budgetMax: e.target.value }))
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" to={`/client/requirements/${id}`}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>Save</Button>
          </div>
        </form>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardBody>
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  <Badge tone={statusTone(data.status)}>{titleCase(data.status)}</Badge>
                  <span className="text-sm text-ink-500">
                    {titleCase(data.platform)}
                  </span>
                </div>
                <p className="text-ink-700 whitespace-pre-line">{data.description}</p>
                <div className="mt-5 grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-ink-500">Budget</div>
                    <div className="font-medium text-ink-900">
                      ${data.budgetMin || 0}–${data.budgetMax || 0} {data.budgetCurrency}
                    </div>
                  </div>
                  <div>
                    <div className="text-ink-500">English level</div>
                    <div className="font-medium text-ink-900">{titleCase(data.englishLevel || '')}</div>
                  </div>
                  <div>
                    <div className="text-ink-500">Timezone</div>
                    <div className="font-medium text-ink-900">{data.timezone || 'Any'}</div>
                  </div>
                  <div>
                    <div className="text-ink-500">Hours/week</div>
                    <div className="font-medium text-ink-900">{data.hoursPerWeek || 40}</div>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="text-ink-500 text-sm mb-2">Required skills</div>
                  <div className="flex flex-wrap gap-2">
                    {(data.requiredSkills || []).map((s, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-brand-50 text-brand-700">
                        {s.name || s.skill?.name || s}
                      </span>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="font-semibold text-ink-900 mb-3">Actions</div>
                <div className="flex flex-col gap-2">
                  <Button to={`/client/trial-tasks?requirementId=${id}`}>Create trial task</Button>
                  <Button variant="secondary" to="/client/find-vas">Browse VAs</Button>
                  <Button variant="secondary" to="/client/compare">Compare VAs</Button>
                </div>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader
              title="Matched VAs"
              subtitle="Ranked by our deterministic matching engine."
              action={<Button size="sm" variant="secondary" onClick={loadMatches} loading={matchLoading}>Reload</Button>}
            />
            <CardBody>
              {matchLoading ? (
                <div className="py-10 flex justify-center"><Spinner /></div>
              ) : matches.length === 0 ? (
                <EmptyState
                  icon="🔎"
                  title="No matches yet"
                  description="No VAs currently match your requirement. Try broadening the filters."
                />
              ) : (
                <ul className="space-y-3">
                  {matches.map((m, idx) => {
                    const va = m.va || m;
                    const vaUser = va.user || {};
                    const name = `${vaUser.firstName || ''} ${vaUser.lastName || ''}`.trim() || 'VA';
                    return (
                      <li key={va._id || idx} className="border border-ink-100 rounded-xl p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <Avatar src={vaUser.avatarUrl} name={name} size="lg" />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-ink-500">#{idx + 1}</span>
                              <Link
                                to={`/client/vas/${va._id}`}
                                className="font-semibold text-ink-900 hover:text-brand-700"
                              >
                                {name}
                              </Link>
                              <ScoreBadge score={m.score} label="Match" />
                              {va.verificationStatus === 'verified' && (
                                <span className="text-xs text-emerald-700 font-medium">✓ Verified</span>
                              )}
                            </div>
                            <div className="text-sm text-ink-500 mt-1">
                              {va.headline || 'E-commerce VA'} · {va.country || '—'}
                            </div>
                            <div className="mt-3">
                              <MatchBar score={m.score || 0} label="Overall" />
                            </div>
                            {m.reasons && m.reasons.length > 0 && (
                              <ul className="mt-2 text-xs text-ink-600 list-disc pl-4">
                                {m.reasons.slice(0, 3).map((r, i) => (
                                  <li key={i}>{r}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                            <Button size="sm" to={`/client/vas/${va._id}`}>View</Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => onShortlist(va._id)}
                            >
                              Shortlist
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
        </>
      )}
    </div>
  );
}