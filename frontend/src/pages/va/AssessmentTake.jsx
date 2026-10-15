import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody, CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ScoreBadge from '../../components/common/ScoreBadge.jsx';
import { assessmentService } from '../../services/assessment.service.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function AssessmentTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [result, setResult] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const a = await assessmentService.getById(id);
      setAssessment(a?.assessment || a);
      let qs = a?.questions;
      if (!qs || !Array.isArray(qs)) {
        const q = await assessmentService.listQuestions(id);
        qs = q?.items || q || [];
      }
      setQuestions(qs);
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

  const answeredCount = useMemo(
    () => Object.keys(answers).filter((k) => answers[k] != null && answers[k] !== '').length,
    [answers]
  );

  const currentQ = questions[currentIdx];
  const totalQ = questions.length;

  const selectOption = (qId, val) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const goNext = () => setCurrentIdx((i) => Math.min(i + 1, totalQ - 1));
  const goPrev = () => setCurrentIdx((i) => Math.max(i - 1, 0));

  const onSubmit = async () => {
    setConfirm(false);
    if (answeredCount < totalQ) {
      toast.warning(`You have ${totalQ - answeredCount} unanswered questions.`);
      return;
    }
    setSubmitting(true);
    try {
      const payload = questions.map((q) => ({
        questionId: q._id,
        answer: answers[q._id]
      }));
      const res = await assessmentService.submit(id, payload);
      const result = res?.result || res;
      setResult(result);
      toast.success('Assessment submitted');
    } catch (err) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;
  if (error) return <ErrorState message={error.message} onRetry={load} />;
  if (!assessment) return <EmptyState title="Assessment not found" />;

  if (result) {
    return (
      <div>
        <PageHeader title="Assessment result" subtitle={assessment.title} />
        <Card>
          <CardBody>
            <div className="text-center py-6">
              <div className="text-5xl font-bold text-ink-900">
                {Math.round(result.score || 0)}/100
              </div>
              <div className="mt-3">
                <ScoreBadge score={result.score} label="Score" />
              </div>
              <p className="mt-4 text-ink-600">
                {result.score >= 70
                  ? 'Great job! This skill is now verified on your profile.'
                  : 'Keep practicing. You can retake this assessment anytime.'}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button to="/va/assessments">Back to assessments</Button>
                <Button variant="secondary" onClick={() => {
                  setResult(null);
                  setAnswers({});
                  setCurrentIdx(0);
                  load();
                }}>
                  Retake
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (totalQ === 0) {
    return (
      <div>
        <PageHeader title={assessment.title} />
        <EmptyState title="No questions available for this assessment yet." />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link to="/va/assessments" className="text-sm text-ink-500 hover:text-ink-800">
          ← Back to assessments
        </Link>
      </div>

      <PageHeader
        title={assessment.title}
        subtitle={`Question ${currentIdx + 1} of ${totalQ} · Answered ${answeredCount}/${totalQ}`}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {currentQ && (
            <Card>
              <CardBody>
                <div className="text-sm text-ink-500 mb-2">Question {currentIdx + 1}</div>
                <h2 className="text-lg font-semibold text-ink-900 whitespace-pre-line">
                  {currentQ.question || currentQ.text || currentQ.prompt}
                </h2>

                {Array.isArray(currentQ.options) && currentQ.options.length > 0 && (
                  <div className="mt-5 space-y-2">
                    {currentQ.options.map((opt, i) => {
                      const value = typeof opt === 'string' ? opt : opt.value;
                      const label = typeof opt === 'string' ? opt : opt.label;
                      const selected = answers[currentQ._id] === value;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => selectOption(currentQ._id, value)}
                          className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                            selected
                              ? 'border-brand-500 bg-brand-50 text-brand-800'
                              : 'border-ink-200 hover:border-ink-300'
                          }`}
                        >
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + i)}.
                          </span>
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {currentQ.type === 'text' && (
                  <textarea
                    rows={5}
                    className="input-base mt-5"
                    value={answers[currentQ._id] || ''}
                    onChange={(e) => selectOption(currentQ._id, e.target.value)}
                  />
                )}

                <div className="mt-6 flex items-center justify-between">
                  <Button variant="secondary" onClick={goPrev} disabled={currentIdx === 0}>
                    Previous
                  </Button>
                  <div className="text-sm text-ink-500">
                    {answeredCount}/{totalQ} answered
                  </div>
                  {currentIdx < totalQ - 1 ? (
                    <Button onClick={goNext}>Next</Button>
                  ) : (
                    <Button variant="success" onClick={() => setConfirm(true)} disabled={submitting}>
                      Submit
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Questions" />
            <CardBody>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, i) => {
                  const done = answers[q._id] != null && answers[q._id] !== '';
                  return (
                    <button
                      key={q._id}
                      onClick={() => setCurrentIdx(i)}
                      className={`h-9 w-9 rounded-lg text-sm font-medium ${
                        i === currentIdx
                          ? 'bg-brand-600 text-white'
                          : done
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-ink-100 text-ink-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4">
                <Button onClick={() => setConfirm(true)} className="w-full" disabled={submitting}>
                  Submit assessment
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={onSubmit}
        title="Submit assessment?"
        message={`You've answered ${answeredCount} of ${totalQ} questions.`}
        confirmText="Submit"
        variant="primary"
        loading={submitting}
      />
    </div>
  );
}