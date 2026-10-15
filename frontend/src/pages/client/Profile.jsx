import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Button from '../../components/ui/Button.jsx';
import { Spinner } from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { clientService } from '../../services/client.service.js';
import { userService } from '../../services/user.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { ECOM_PLATFORMS, TIMEZONES } from '../../utils/constants.js';

export default function Profile() {
  const toast = useToast();
  const { user, refresh } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({
    companyName: '',
    website: '',
    platform: '',
    country: '',
    timezone: '',
    about: '',
    contactEmail: ''
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
      const res = await clientService.getProfile();
      const p = res?.profile || {};
      setValues({
        companyName: p.companyName || '',
        website: p.website || '',
        platform: p.platform || '',
        country: p.country || '',
        timezone: p.timezone || '',
        about: p.about || '',
        contactEmail: p.contactEmail || ''
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
      await Promise.all([
        clientService.updateProfile(values),
        userService.updateMe(userValues)
      ]);
      await refresh();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) return <ErrorState message={error.message} onRetry={load} />;

  return (
    <div>
      <PageHeader title="Client profile" subtitle="Your store and contact details." />
      <form onSubmit={onSave} className="grid lg:grid-cols-2 gap-6">
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
            <h2 className="font-semibold text-ink-900 mb-4">Store profile</h2>
            <Input
              label="Company / store name"
              name="companyName"
              value={values.companyName}
              onChange={onChange}
            />
            <Input
              label="Website"
              name="website"
              value={values.website}
              onChange={onChange}
              className="mt-4"
            />
            <Select
              label="Primary platform"
              name="platform"
              value={values.platform}
              onChange={onChange}
              className="mt-4"
            >
              <option value="">Select platform</option>
              {ECOM_PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </Select>
            <Select
              label="Timezone"
              name="timezone"
              value={values.timezone}
              onChange={onChange}
              className="mt-4"
            >
              <option value="">Select timezone</option>
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </Select>
            <Input
              label="Country"
              name="country"
              value={values.country}
              onChange={onChange}
              className="mt-4"
            />
            <Input
              label="Contact email"
              name="contactEmail"
              type="email"
              value={values.contactEmail}
              onChange={onChange}
              className="mt-4"
            />
            <Textarea
              label="About your store"
              name="about"
              rows={4}
              value={values.about}
              onChange={onChange}
              className="mt-4"
            />
          </CardBody>
        </Card>

        <div className="lg:col-span-2 flex justify-end">
          <Button type="submit" loading={saving}>Save changes</Button>
        </div>
      </form>
    </div>
  );
}