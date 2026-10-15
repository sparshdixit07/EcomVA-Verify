import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { authService } from '../../services/auth.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import { isEmail } from '../../utils/validators.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError('Enter a valid email');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email.trim().toLowerCase());
      setSubmitted(true);
      toast.success('If the account exists, a reset link has been sent.');
    } catch (err) {
      toast.error(err.message || 'Could not send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-ink-900 text-center">Reset your password</h1>
        <p className="mt-2 text-sm text-ink-500 text-center">
          Enter your email and we'll send you a reset link.
        </p>
        <form onSubmit={onSubmit} className="card p-6 mt-6 space-y-4" noValidate>
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            required
          />
          <Button type="submit" className="w-full" loading={loading}>
            Send reset link
          </Button>
          {submitted && (
            <p className="text-sm text-emerald-600">
              Check your inbox. If you don't see it, check your spam folder.
            </p>
          )}
          <p className="text-center text-sm text-ink-500">
            Remembered?{' '}
            <Link to="/login" className="link">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}