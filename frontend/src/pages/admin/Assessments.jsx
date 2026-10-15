import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Modal from '../../components/ui/Modal.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { assessmentService } from '../../services/assessment.service.js';
import { skillService } from '../../services/skill.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { ASSESSMENT_DIFFICULTY, ECOM_PLATFORMS } from '../../utils/constants.js';

export default function Assessments() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ open: false, editing: null });
  const [values, setValues] = useState({
    title: '',
    description: '',
    skillId: '',
    platform: 'amazon',
    difficulty: 'medium',
    durationMinutes: 30,
    passingScore: 70
  });
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null, loading: false });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [a, s] = await Promise.all([
        assessmentService.list({}),
        skillService.list()
      ]);
      setItems(a?.items || a || []);
      setSkills(s?.items || s || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setValues({
      title: '',
      description: '',
      skillId: '',
      platform: 'amazon',
      difficulty: 'medium',
      durationMinutes: 30,
      passingScore: 70
    });
    setModal({ open: true, editing: null });
  };

  const openEdit = (a) => {
    setValues({
      title: a.title || '',
      description: a.description || '',
      skillId: a.skill?._id || a.skillId || '',
      platform: a.platform || 'amazon',
      difficulty: a.difficulty || 'medium',
      durationMinutes: a.durationMinutes || 30,
      passingScore: a.passingScore || 70
    });
    setModal({ open: true, editing: a });
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!values.title.trim() || !values.skillId) {
      toast.error('Title and skill are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...values,
        durationMinutes: Number(values.durationMinutes) || 30,
        passingScore: Number(values.passingScore) || 70
      };
      if (modal.editing) {
        await assessmentService.updateAssessment(modal.editing._id, payload);
      } else {
        await assessmentService.createAssessment(payload);
      }
      toast.success('Saved');
      setModal({ open: false, editing: null });
      load();
    } catch (err) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await assessmentService.deleteAssessment(confirm.id);
      toast.success('Deleted');
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
        title="Assessments"
        subtitle="Create and manage skill assessments."
        action={<Button onClick={openAdd}>+ New assessment</Button>}
      />

      {loading ? (
        <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
      ) : error ? (
        <ErrorState message={error.message} onRetry={load} />
      ) : items.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="🧠"
              title="No assessments yet"
              description="Create your first skill assessment."
              action={<Button onClick={openAdd}>Create assessment</Button>}
            />
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <Card key={a._id}>
              <CardBody>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-ink-900">{a.title}</span>
                      <Badge tone="brand">{a.difficulty || 'medium'}</Badge>
                      {a.platform && <Badge>{a.platform}</Badge>}
                    </div>
                    {a.description && (
                      <p className="text-sm text-ink-500 mt-1 line-clamp-2">{a.description}</p>
                    )}
                    <div className="text-xs text-ink-500 mt-1">
                      {a.questionsCount || a.questionCount || 0} questions · Pass at {a.passingScore || 70}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Link to={`/admin/questions?assessmentId=${a._id}`} className="link text-sm text-center">
                      Questions →
                    </Link>
                    <Button size="sm" variant="secondary" onClick={() => openEdit(a)}>Edit</Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setConfirm({ open: true, id: a._id, loading: false })}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, editing: null })}
        title={modal.editing ? 'Edit assessment' : 'New assessment'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal({ open: false, editing: null })}>
              Cancel
            </Button>
            <Button onClick={onSave} loading={saving}>Save</Button>
          </>
        }
      >
        <form onSubmit={onSave} className="space-y-4">
          <Input
            label="Title"
            value={values.title}
            onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
            required
          />
          <Textarea
            label="Description"
            rows={3}
            value={values.description}
            onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Skill"
              value={values.skillId}
              onChange={(e) => setValues((v) => ({ ...v, skillId: e.target.value }))}
              required
            >
              <option value="">Select skill</option>
              {skills.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </Select>
            <Select
              label="Platform"
              value={values.platform}
              onChange={(e) => setValues((v) => ({ ...v, platform: e.target.value }))}
            >
              {ECOM_PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </Select>
            <Select
              label="Difficulty"
              value={values.difficulty}
              onChange={(e) => setValues((v) => ({ ...v, difficulty: e.target.value }))}
            >
              {Object.values(ASSESSMENT_DIFFICULTY).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
            <Input
              label="Duration (min)"
              type="number"
              value={values.durationMinutes}
              onChange={(e) => setValues((v) => ({ ...v, durationMinutes: e.target.value }))}
            />
            <Input
              label="Passing score"
              type="number"
              value={values.passingScore}
              onChange={(e) => setValues((v) => ({ ...v, passingScore: e.target.value }))}
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null, loading: false })}
        onConfirm={onDelete}
        title="Delete assessment?"
        message="This will remove the assessment and its questions."
        confirmText="Delete"
        loading={confirm.loading}
      />
    </div>
  );
}