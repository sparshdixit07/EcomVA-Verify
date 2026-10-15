import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
import { useToast } from '../../context/ToastContext.jsx';

export default function Questions() {
  const [params, setParams] = useSearchParams();
  const toast = useToast();
  const assessmentId = params.get('assessmentId') || '';
  const [assessments, setAssessments] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ open: false, editing: null });
  const [values, setValues] = useState({
    question: '',
    type: 'single',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    points: 1
  });
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null, loading: false });

  useEffect(() => {
    (async () => {
      try {
        const res = await assessmentService.list({});
        const list = res?.items || res || [];
        setAssessments(list);
        if (!assessmentId && list[0]?._id) {
          const next = new URLSearchParams(params);
          next.set('assessmentId', list[0]._id);
          setParams(next, { replace: true });
        }
      } catch (err) {
        setError(err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadQuestions = async () => {
    if (!assessmentId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await assessmentService.listQuestions(assessmentId);
      setItems(res?.items || res || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentId]);

  const openAdd = () => {
    setValues({
      question: '',
      type: 'single',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      points: 1
    });
    setModal({ open: true, editing: null });
  };

  const openEdit = (q) => {
    setValues({
      question: q.question || '',
      type: q.type || 'single',
      options: (q.options || []).map((o) => (typeof o === 'string' ? o : o.value || o.label)) || ['', '', '', ''],
      correctAnswer: q.correctAnswer || '',
      explanation: q.explanation || '',
      points: q.points || 1
    });
    setModal({ open: true, editing: q });
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!values.question.trim()) {
      toast.error('Question text is required');
      return;
    }
    if (!assessmentId) {
      toast.error('Select an assessment first');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        question: values.question,
        type: values.type,
        options: values.type === 'text' ? [] : values.options.filter((o) => o.trim()),
        correctAnswer: values.correctAnswer,
        explanation: values.explanation,
        points: Number(values.points) || 1
      };
      if (modal.editing) {
        await assessmentService.updateQuestion(assessmentId, modal.editing._id, payload);
      } else {
        await assessmentService.createQuestion(assessmentId, payload);
      }
      toast.success('Saved');
      setModal({ open: false, editing: null });
      loadQuestions();
    } catch (err) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await assessmentService.deleteQuestion(assessmentId, confirm.id);
      toast.success('Deleted');
      setConfirm({ open: false, id: null, loading: false });
      loadQuestions();
    } catch (err) {
      toast.error(err.message || 'Delete failed');
      setConfirm((c) => ({ ...c, loading: false }));
    }
  };

  const updateOption = (i, val) => {
    setValues((v) => {
      const next = [...v.options];
      next[i] = val;
      return { ...v, options: next };
    });
  };

  return (
    <div>
      <PageHeader
        title="Assessment questions"
        subtitle="Manage the questions for each assessment."
        action={
          <div className="flex gap-2">
            <Link to="/admin/assessments" className="link text-sm self-center">← Assessments</Link>
            <Button onClick={openAdd} disabled={!assessmentId}>+ New question</Button>
          </div>
        }
      />

      <Card className="mb-6">
        <CardBody>
          <Select
            label="Assessment"
            value={assessmentId}
            onChange={(e) => {
              const next = new URLSearchParams(params);
              next.set('assessmentId', e.target.value);
              setParams(next, { replace: true });
            }}
          >
            <option value="">Select assessment</option>
            {assessments.map((a) => (
              <option key={a._id} value={a._id}>{a.title}</option>
            ))}
          </Select>
        </CardBody>
      </Card>

      {loading ? (
        <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
      ) : error ? (
        <ErrorState message={error.message} onRetry={loadQuestions} />
      ) : !assessmentId ? (
        <EmptyState icon="❓" title="Select an assessment to manage its questions" />
      ) : items.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="❓"
              title="No questions yet"
              description="Add the first question to this assessment."
              action={<Button onClick={openAdd}>Add question</Button>}
            />
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((q, i) => (
            <Card key={q._id}>
              <CardBody>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-ink-500">Q{i + 1}</span>
                      <Badge>{q.type || 'single'}</Badge>
                      <Badge tone="neutral">{q.points || 1} pt</Badge>
                    </div>
                    <div className="font-medium text-ink-900 whitespace-pre-line">
                      {q.question}
                    </div>
                    {Array.isArray(q.options) && q.options.length > 0 && (
                      <ul className="mt-2 text-sm text-ink-600 list-disc pl-5">
                        {q.options.map((o, idx) => {
                          const val = typeof o === 'string' ? o : o.value || o.label;
                          const isCorrect = val === q.correctAnswer;
                          return (
                            <li key={idx} className={isCorrect ? 'text-emerald-700 font-medium' : ''}>
                              {val} {isCorrect && '✓'}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="secondary" onClick={() => openEdit(q)}>Edit</Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setConfirm({ open: true, id: q._id, loading: false })}
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
        title={modal.editing ? 'Edit question' : 'New question'}
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
          <Textarea
            label="Question"
            rows={3}
            value={values.question}
            onChange={(e) => setValues((v) => ({ ...v, question: e.target.value }))}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Type"
              value={values.type}
              onChange={(e) => setValues((v) => ({ ...v, type: e.target.value }))}
            >
              <option value="single">Single choice</option>
              <option value="multiple">Multiple choice</option>
              <option value="text">Free text</option>
            </Select>
            <Input
              label="Points"
              type="number"
              value={values.points}
              onChange={(e) => setValues((v) => ({ ...v, points: e.target.value }))}
            />
          </div>
          {values.type !== 'text' && (
            <>
              {values.options.map((o, i) => (
                <Input
                  key={i}
                  label={`Option ${String.fromCharCode(65 + i)}`}
                  value={o}
                  onChange={(e) => updateOption(i, e.target.value)}
                />
              ))}
              <Input
                label="Correct answer (must match an option exactly)"
                value={values.correctAnswer}
                onChange={(e) => setValues((v) => ({ ...v, correctAnswer: e.target.value }))}
              />
            </>
          )}
          {values.type === 'text' && (
            <Input
              label="Expected answer (optional)"
              value={values.correctAnswer}
              onChange={(e) => setValues((v) => ({ ...v, correctAnswer: e.target.value }))}
            />
          )}
          <Textarea
            label="Explanation (optional)"
            rows={2}
            value={values.explanation}
            onChange={(e) => setValues((v) => ({ ...v, explanation: e.target.value }))}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null, loading: false })}
        onConfirm={onDelete}
        title="Delete question?"
        message="This action cannot be undone."
        confirmText="Delete"
        loading={confirm.loading}
      />
    </div>
  );
}