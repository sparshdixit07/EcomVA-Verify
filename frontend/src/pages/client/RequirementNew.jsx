import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Button from '../../components/ui/Button.jsx';
import { requirementService } from '../../services/requirement.service.js';
import { skillService } from '../../services/skill.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { validateRequirement } from '../../utils/validators.js';
import {
  ECOM_PLATFORMS,
  ENGLISH_LEVELS,
  TIMEZONES
} from '../../utils/constants.js';

export default function RequirementNew() {
  const navigate = useNavigate();
  const toast = useToast();
  const [skills, setSkills] = useState([]);
  const [values, setValues] = useState({
    title: '',
    platform: 'amazon',
    description: '',
    requiredSkills: [],
    englishLevel: 'professional',
    timezone: '',
    availability: 'full_time',
    budgetMin: '',
    budgetMax: '',
    budgetCurrency: 'USD',
    hoursPerWeek: 40
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await skillService.list();
        setSkills(res?.items || res || []);
      } catch {
        setSkills([]);
      }
    })();
  }, []);

  const onChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    setErrors((x) => ({ ...x, [e.target.name]: undefined }));
  };

  const toggleSkill = (id) => {
    setValues((v) => {
      const set = new Set(v.requiredSkills);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...v, requiredSkills: Array.from(set) };
    });
    setErrors((x) => ({ ...x, requiredSkills: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validateRequirement(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const payload = {
        ...values,
        budgetMin: Number(values.budgetMin) || 0,
        budgetMax: Number(values.budgetMax) || 0,
        hoursPerWeek: Number(values.hoursPerWeek) || 40
      };
      const created = await requirementService.create(payload);
      toast.success('Requirement created');
      const id = created?._id || created?.requirement?._id;
      navigate(id ? `/client/requirements/${id}` : '/client/requirements');
    } catch (err) {
      toast.error(err.message || 'Could not create requirement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="New requirement" subtitle="Describe what you're hiring for." />
      <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardBody>
              <h2 className="font-semibold text-ink-900 mb-4">Requirement details</h2>
              <Input
                label="Title"
                name="title"
                value={values.title}
                onChange={onChange}
                error={errors.title}
                placeholder="Amazon listing specialist for 50 SKUs"
                required
              />
              <Select
                label="Platform"
                name="platform"
                value={values.platform}
                onChange={onChange}
                error={errors.platform}
                className="mt-4"
                required
              >
                {ECOM_PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </Select>
              <Textarea
                label="Description"
                name="description"
                rows={6}
                value={values.description}
                onChange={onChange}
                error={errors.description}
                className="mt-4"
                hint="Be specific: scope, deliverables, tools."
                required
              />
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="font-semibold text-ink-900 mb-4">Required skills</h2>
              {skills.length === 0 ? (
                <p className="text-sm text-ink-500">Loading skills…</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => {
                    const id = s._id || s.value || s.name;
                    const active = values.requiredSkills.includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleSkill(id)}
                        className={`text-sm px-3 py-1.5 rounded-full border transition ${
                          active
                            ? 'bg-brand-600 text-white border-brand-600'
                            : 'bg-white text-ink-700 border-ink-200 hover:border-ink-300'
                        }`}
                      >
                        {s.name || s.label}
                      </button>
                    );
                  })}
                </div>
              )}
              {errors.requiredSkills && <p className="error-text mt-2">{errors.requiredSkills}</p>}
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="font-semibold text-ink-900 mb-4">Preferences</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Select
                  label="English level"
                  name="englishLevel"
                  value={values.englishLevel}
                  onChange={onChange}
                >
                  {ENGLISH_LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Timezone preference"
                  name="timezone"
                  value={values.timezone}
                  onChange={onChange}
                >
                  <option value="">Any timezone</option>
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Availability"
                  name="availability"
                  value={values.availability}
                  onChange={onChange}
                >
                  <option value="full_time">Full time</option>
                  <option value="part_time">Part time</option>
                  <option value="project">Project based</option>
                  <option value="hourly">Hourly</option>
                </Select>
                <Input
                  label="Hours per week"
                  name="hoursPerWeek"
                  type="number"
                  min="1"
                  max="80"
                  value={values.hoursPerWeek}
                  onChange={onChange}
                />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardBody>
              <h2 className="font-semibold text-ink-900 mb-4">Budget</h2>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Min"
                  name="budgetMin"
                  type="number"
                  min="0"
                  value={values.budgetMin}
                  onChange={onChange}
                  error={errors.budgetMin}
                />
                <Input
                  label="Max"
                  name="budgetMax"
                  type="number"
                  min="0"
                  value={values.budgetMax}
                  onChange={onChange}
                  error={errors.budgetMax}
                />
              </div>
              <Select
                label="Currency"
                name="budgetCurrency"
                value={values.budgetCurrency}
                onChange={onChange}
                className="mt-4"
              >
                <option value="USD">USD</option>
                <option value="PHP">PHP</option>
                <option value="IDR">IDR</option>
                <option value="SGD">SGD</option>
              </Select>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Button type="submit" className="w-full" loading={submitting}>
                Create requirement
              </Button>
              <p className="mt-3 text-xs text-ink-500">
                After creating, you'll see matched VAs ranked by our scoring engine.
              </p>
            </CardBody>
          </Card>
        </div>
      </form>
    </div>
  );
}