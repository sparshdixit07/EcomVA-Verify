import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { authService } from '../../services/auth.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { isStrongPassword } from '../../utils/validators.js';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const toast = useToast();
  const [values, setValues] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!token) errs.token = 'Missing reset token. Please use the link from your email.';
    if (!isStrongPassword(values.password))
      errs.password = 'Min 8 chars with at least one letter and one number';
    if (values.password !== values.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await authService.resetPassword({ token, password: values.password });
      toast.success('Password updated. Please sign in.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Could not reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-ink-900 text-center">Set a new password</h1>
        <form onSubmit={onSubmit} className="card p-6 mt-6 space-y-4" noValidate>
          {errors.token && <p className="error-text">{errors.token}</p>}
          <Input
            label="New password"
            name="password"
            type="password"
            value={values.password}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
            error={errors.password}
            required
          />
          <Input
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={(e) => setValues((v) => ({ ...v, confirmPassword: e.target.value }))}
            error={errors.confirmPassword}
            required
          />
          <Button type="submit" className="w-full" loading={loading}>
            Update password
          </Button>
          <p className="text-center text-sm text-ink-500">
            <Link to="/login" className="link">
              Back to sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}