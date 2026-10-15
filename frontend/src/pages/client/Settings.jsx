import { useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { authService } from '../../services/auth.service.js';
import { userService } from '../../services/user.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { isStrongPassword } from '../../utils/validators.js';

export default function Settings() {
  const toast = useToast();
  const { refresh } = useAuth();
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [savingPw, setSavingPw] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large (max 5MB)');
      return;
    }
    setUploading(true);
    try {
      await userService.uploadAvatar(file);
      await refresh();
      toast.success('Avatar updated');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Account security and preferences." />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h2 className="font-semibold text-ink-900 mb-4">Profile photo</h2>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onUpload}
              disabled={uploading}
              className="text-sm"
            />
            {uploading && <p className="text-xs text-ink-500 mt-2">Uploading…</p>}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="font-semibold text-ink-900 mb-4">Change password</h2>
            <form onSubmit={onChangePassword} className="space-y-3">
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
              <Button type="submit" loading={savingPw}>Update password</Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}