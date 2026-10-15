import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody, CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Modal from '../../components/ui/Modal.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { vaService } from '../../services/va.service.js';
import { skillService } from '../../services/skill.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { ECOM_PLATFORMS } from '../../utils/constants.js';

export default function Skills() {
  const toast = useToast();
  const [skills, setSkills] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modal, setModal] = useState({ open: false, editing: null });
  const [values, setValues] = useState({
    skillId: '',
    platform: 'amazon',
    yearsExperience: '',
    level: 'intermediate'
  });
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null, loading: false });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, c] = await Promise.all([
        vaService.getProfile(),
        skillService.list()
      ]);
      const prof = p?.profile || {};
      setSkills(prof.skills || []);
      setCatalog(c?.items || c || []);
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
    setValues({ skillId: '', platform: 'amazon', yearsExperience: '', level: 'intermediate' });
    setModal({ open: true, editing: null });
  };

  const openEdit = (skill) => {
    setValues({
      skillId: skill.skill?._id || skill.skillId || '',
      platform: skill.platform || 'amazon',
      yearsExperience: skill.yearsExperience ?? '',
      level: skill.level || 'intermediate'
    });
    setModal({ open: true, editing: skill });
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!values.skillId) {
      toast.error('Select a skill');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        skillId: values.skillId,
        platform: values.platform,
        yearsExperience: Number(values.yearsExperience) || 0,
        level: values.level
      };
      if (modal.editing) {
        await vaService.updateSkill(modal.editing._id, payload);
      } else {
        await vaService.addSkill(payload);
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

  const onRemove = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await vaService.removeSkill(confirm.id);
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
        title="Skills"
        subtitle="List the e-commerce skills you provide and take assessments to prove them."
        action={<Button onClick={openAdd}>+ Add skill</Button>}
      />

      {skills.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="🛠️"
              title="No skills yet"
              description="Add your first skill to appear in searches."
              action={<Button onClick={openAdd}>Add skill</Button>}
            />
          </CardBody>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((s) => (
            <Card key={s._id}>
              <CardBody>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-ink-900">
                      {s.name || s.skill?.name || 'Skill'}
                    </div>
                    <div className="text-xs text-ink-500 capitalize mt-0.5">
                      {s.platform}
                    </div>
                  </div>
                  {typeof s.score === 'number' && (
                    <Badge tone="success">{s.score}/100</Badge>
                  )}
                </div>
                <div className="mt-3 text-xs text-ink-600">
                  {s.yearsExperience || 0} yrs · {s.level || 'intermediate'}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => openEdit(s)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setConfirm({ open: true, id: s._id, loading: false })}
                  >
                    Remove
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, editing: null })}
        title={modal.editing ? 'Edit skill' : 'Add skill'}
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
          <Select
            label="Skill"
            value={values.skillId}
            onChange={(e) => setValues((v) => ({ ...v, skillId: e.target.value }))}
            required
          >
            <option value="">Select skill</option>
            {catalog.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
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
          <Input
            label="Years of experience"
            type="number"
            min="0"
            value={values.yearsExperience}
            onChange={(e) => setValues((v) => ({ ...v, yearsExperience: e.target.value }))}
          />
          <Select
            label="Level"
            value={values.level}
            onChange={(e) => setValues((v) => ({ ...v, level: e.target.value }))}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </Select>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null, loading: false })}
        onConfirm={onRemove}
        title="Remove skill?"
        message="This skill will no longer appear on your profile."
        confirmText="Remove"
        loading={confirm.loading}
      />
    </div>
  );
}