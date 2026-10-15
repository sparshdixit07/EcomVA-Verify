import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { vaService } from '../../services/va.service.js';
import { userService } from '../../services/user.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { ENGLISH_LEVELS, TIMEZONES } from '../../utils/constants.js';

const AVAILABILITY = [
  { value: 'full_time', label: 'Full time' },
  { value: 'part_time', label: 'Part time' },
  { value: 'project', label: 'Project based' },
  { value: 'hourly', label: 'Hourly' }
];

export default function Profile() {
  const toast = useToast();
  const { user, refresh } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({
    headline: '',
    bio: '',
    country: '',
    timezone: '',
    hourlyRate: '',
    yearsExperience: '',
    englishLevel: 'professional',
    availability: 'full_time',
    languages: '',
    portfolioUrl: ''
  });
  const [userValues, setUserValues] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await vaService.getProfile();
      const p = res?.profile || {};
      setValues({
        headline: p.headline || '',
        bio: p.bio || '',
        country: p.country || '',
        timezone: p.timezone || '',
        hourlyRate: p.hourlyRate ?? '',
        yearsExperience: p.yearsExperience ?? '',
        englishLevel: p.englishLevel || 'professional',
        availability: p.availability || 'full_time',
        languages: Array.isArray(p.languages) ? p.languages.join(', ') : p.languages || '',
        portfolioUrl: p.portfolioUrl || ''
      });
      setUserValues({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || ''
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  const onUserChange = (e) =>
    setUserValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...values,
        hourlyRate: values.hourlyRate === '' ? null : Number(values.hourlyRate),
        yearsExperience:
          values.yearsExperience === '' ? null : Number(values.yearsExperience),
        languages: values.languages
          ? values.languages.split(',').map((s) => s.trim()).filter(Boolean)
          : []
      };
      await Promise.all([
        vaService.updateProfile(payload),
        userService.updateMe(userValues)
      ]);
      await refresh();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;
  if (error) return <ErrorState message={error.message} onRetry={load} />;

  return (
    <div>
      <PageHeader title="VA profile" subtitle="Your public-facing information." />
      <form onSubmit={onSave} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardBody>
              <h2 className="font-semibold text-ink-900 mb-4">Account</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="First name"
                  name="firstName"
                  value={userValues.firstName}
                  onChange={onUserChange}
                  required
                />
                <Input
                  label="Last name"
                  name="lastName"
                  value={userValues.lastName}
                  onChange={onUserChange}
                  required
                />
              </div>
              <Input
                label="Phone"
                name="phone"
                value={userValues.phone}
                onChange={onUserChange}
                className="mt-4"
              />
              <Input
                label="Login email"
                value={user?.email || ''}
                disabled
                className="mt-4"
                hint="Contact support to change your login email."
              />
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="font-semibold text-ink-900 mb-4">Professional</h2>
              <Input
                label="Headline"
                name="headline"
                value={values.headline}
                onChange={onChange}
                placeholder="Amazon listing specialist with 3+ years"
                required
              />
              <Textarea
                label="Bio"
                name="bio"
                rows={6}
                value={values.bio}
                onChange={onChange}
                className="mt-4"
                hint="Describe your e-commerce experience, tools and strengths."
              />
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Country"
                  name="country"
                  value={values.country}
                  onChange={onChange}
                />
                <Select
                  label="Timezone"
                  name="timezone"
                  value={values.timezone}
                  onChange={onChange}
                >
                  <option value="">Select timezone</option>
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </Select>
                <Input
                  label="Years of experience"
                  name="yearsExperience"
                  type="number"
                  min="0"
                  value={values.yearsExperience}
                  onChange={onChange}
                />
                <Input
                  label="Hourly rate (USD)"
                  name="hourlyRate"
                  type="number"
                  min="0"
                  value={values.hourlyRate}
                  onChange={onChange}
                />
                <Select
                  label="English level"
                  name="englishLevel"
                  value={values.englishLevel}
                  onChange={onChange}
                >
                  {ENGLISH_LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </Select>
                <Select
                  label="Availability"
                  name="availability"
                  value={values.availability}
                  onChange={onChange}
                >
                  {AVAILABILITY.map((a) => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </Select>
              </div>
              <Input
                label="Languages"
                name="languages"
                value={values.languages}
                onChange={onChange}
                className="mt-4"
                hint="Comma-separated. Example: English, Filipino, Indonesian"
              />
              <Input
                label="Portfolio URL"
                name="portfolioUrl"
                value={values.portfolioUrl}
                onChange={onChange}
                className="mt-4"
              />
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardBody>
              <Button type="submit" className="w-full" loading={saving}>
                Save profile
              </Button>
              <p className="mt-3 text-xs text-ink-500">
                Keep your profile complete to improve match scores and discovery.
              </p>
            </CardBody>
          </Card>
        </div>
      </form>
    </div>
  );
}