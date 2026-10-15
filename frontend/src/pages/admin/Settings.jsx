import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody, CardHeader } from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { adminService } from '../../services/admin.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { authService } from '../../services/auth.service.js';
import { isStrongPassword } from '../../utils/validators.js';

export default function Settings() {
  const { user } = useAuth();
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const s = await adminService.stats();
        setStats(s);
      } catch {
        setStats(null);
      }
    })();
  }, []);

  const onPwChange = (e) => {
    setPw((v) => ({ ...v, [e.target.name]: e.target.value }));
    setErrors((x) => ({ ...x, [e.target.name]: undefined }));
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!pw.currentPassword) errs.currentPassword = 'Current password is required';
    if (!isStrongPassword(pw.newPassword))
      errs.newPassword = 'Min 8 chars with at least one letter and one number';
    if (pw.newPassword !== pw.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSavingPw(true);
    try {
      await authService.changePassword({
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword
      });
      toast.success('Password changed');
      setPw({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Could not change password');
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div>
      <PageHeader title="Admin settings" subtitle="Platform administration." />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Admin account" />
          <CardBody>
            <Input label="Email" value={user?.email || ''} disabled />
            <Input
              label="Name"
              value={`${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
              disabled
              className="mt-4"
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Platform stats" />
          <CardBody>
            {stats ? (
              <ul className="text-sm text-ink-700 space-y-2">
                <li>Total users: <span className="font-semibold">{stats.totalUsers ?? 0}</span></li>
                <li>Total clients: <span className="font-semibold">{stats.totalClients ?? 0}</span></li>
                <li>Total VAs: <span className="font-semibold">{stats.totalVAs ?? 0}</span></li>
                <li>Verified VAs: <span className="font-semibold">{stats.verifiedVAs ?? 0}</span></li>
                <li>Engagements: <span className="font-semibold">{stats.totalEngagements ?? 0}</span></li>
                <li>Trial tasks: <span className="font-semibold">{stats.totalTrialTasks ?? 0}</span></li>
              </ul>
            ) : (
              <p className="text-sm text-ink-500">Loading…</p>
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Change password" />
          <CardBody>
            <form onSubmit={onChangePassword} className="grid sm:grid-cols-3 gap-4 max-w-3xl">
              <Input
                label="Current password"
                name="currentPassword"
                type="password"
                value={pw.currentPassword}
                onChange={onPwChange}
                error={errors.currentPassword}
                required
              />
              <Input
                label="New password"
                name="newPassword"
                type="password"
                value={pw.newPassword}
                onChange={onPwChange}
                error={errors.newPassword}
                required
              />
              <Input
                label="Confirm new password"
                name="confirmPassword"
                type="password"
                value={pw.confirmPassword}
                onChange={onPwChange}
                error={errors.confirmPassword}
                required
              />
              <div className="sm:col-span-3">
                <Button type="submit" loading={savingPw}>Update password</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}