// import { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import Button from '../../components/ui/Button.jsx';
// import Input from '../../components/ui/Input.jsx';
// import { useAuth } from '../../context/AuthContext.jsx';
// import { useToast } from '../../context/ToastContext.jsx';
// import { validateLogin } from '../../utils/validators.js';

// export default function Login() {
//   const { login } = useAuth();
//   const toast = useToast();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const from = location.state?.from;

//   const [values, setValues] = useState({ email: '', password: '' });
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);

//   const onChange = (e) => {
//     setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
//     setErrors((x) => ({ ...x, [e.target.name]: undefined }));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     const errs = validateLogin(values);
//     setErrors(errs);
//     if (Object.keys(errs).length) return;

//     setSubmitting(true);
//     try {
//       const user = await login(values);
//       toast.success('Welcome back!');
//       const fallback =
//         user?.role === 'admin'
//           ? '/admin/dashboard'
//           : user?.role === 'va'
//           ? '/va/dashboard'
//           : '/client/dashboard';
//       navigate(from || fallback, { replace: true });
//     } catch (err) {
//       toast.error(err.message || 'Login failed');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <h1 className="text-2xl font-bold text-ink-900">Welcome back</h1>
//           <p className="mt-2 text-sm text-ink-500">Sign in to your EcomVA Verify account.</p>
//         </div>
//         <form onSubmit={onSubmit} className="card p-6 space-y-4" noValidate>
//           <Input
//             label="Email"
//             name="email"
//             type="email"
//             autoComplete="email"
//             value={values.email}
//             onChange={onChange}
//             error={errors.email}
//             required
//           />
//           <Input
//             label="Password"
//             name="password"
//             type="password"
//             autoComplete="current-password"
//             value={values.password}
//             onChange={onChange}
//             error={errors.password}
//             required
//           />
//           <div className="flex items-center justify-between text-sm">
//             <Link to="/forgot-password" className="link">
//               Forgot password?
//             </Link>
//           </div>
//           <Button type="submit" className="w-full" loading={submitting}>
//             Sign in
//           </Button>
//           <p className="text-sm text-center text-ink-500">
//             Don't have an account?{' '}
//             <Link to="/register" className="link">
//               Create one
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { validateLogin } from '../../utils/validators.js';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    setErrors((x) => ({ ...x, [e.target.name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLogin(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const user = await login(values);
      toast.success('Welcome back!');
      const fallback =
        user?.role === 'admin'
          ? '/admin/dashboard'
          : user?.role === 'va'
          ? '/va/dashboard'
          : '/client/dashboard';
      navigate(from || fallback, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Form side */}
      <div className="flex items-center justify-center px-4 py-12 lg:px-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold text-ink-900 tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              Sign in to your EcomVA Verify account.
            </p>
          </div>

          <form onSubmit={onSubmit} className="card p-6 space-y-4" noValidate>
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={values.email}
              onChange={onChange}
              error={errors.email}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={values.password}
              onChange={onChange}
              error={errors.password}
              required
            />
            <div className="flex items-center justify-end text-sm">
              <Link to="/forgot-password" className="link">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full" loading={submitting} size="lg">
              Sign in
            </Button>
            <p className="text-sm text-center text-ink-500 pt-1">
              Don't have an account?{' '}
              <Link to="/register" className="link">
                Create one
              </Link>
            </p>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-brand-50/60 border border-brand-100 text-xs text-ink-600">
            <div className="font-semibold text-brand-800 mb-1">Demo accounts</div>
            <div className="space-y-0.5">
              <div>client@ecomva-verify.local · Password123</div>
              <div>va@ecomva-verify.local · Password123</div>
              <div>admin@ecomva-verify.local · Password123</div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand side */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 btn-gradient" />
        <div className="absolute inset-0 bg-grid bg-grid opacity-20 mix-blend-overlay" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <div className="relative z-10 max-w-md px-8 text-white animate-fade-in">
          <div className="inline-flex items-center gap-2.5 rounded-xl bg-white/10 border border-white/20 px-3 py-2 backdrop-blur-sm">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white text-brand-700 font-bold text-xs">
              EV
            </span>
            <span className="font-semibold text-sm">EcomVA Verify</span>
          </div>

          <h2 className="mt-8 text-4xl font-bold tracking-tight leading-tight">
            Hire based on verified e-commerce skills.
          </h2>
          <p className="mt-4 opacity-90">
            Real assessments. Real trial tasks. Real performance data. Stop guessing who's actually
            good at Amazon and Shopify.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              'Assessments on Amazon listing, Shopify, CS, inventory',
              'Practical work simulations reviewed by clients',
              'Deterministic matching with factor transparency',
              'Performance tracking on real engagements'
            ].map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                  ✓
                </span>
                <span className="text-sm opacity-95">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}