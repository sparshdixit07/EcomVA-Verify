// import { useMemo, useState } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import Button from '../../components/ui/Button.jsx';
// import Input from '../../components/ui/Input.jsx';
// import { useAuth } from '../../context/AuthContext.jsx';
// import { useToast } from '../../context/ToastContext.jsx';
// import { validateRegister } from '../../utils/validators.js';

// export default function Register() {
//   const [params] = useSearchParams();
//   const initialRole = params.get('role') === 'va' ? 'va' : 'client';
//   const [role, setRole] = useState(initialRole);
//   const { register } = useAuth();
//   const toast = useToast();
//   const navigate = useNavigate();

//   const [values, setValues] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     companyName: '',
//     headline: '',
//     country: '',
//     acceptTerms: false
//   });
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);

//   const onChange = (e) => {
//     const { name, type, value, checked } = e.target;
//     setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
//     setErrors((x) => ({ ...x, [name]: undefined }));
//   };

//   const heading = useMemo(
//     () => (role === 'va' ? 'Create your VA profile' : 'Create your client account'),
//     [role]
//   );

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     const errs = validateRegister(values, role);
//     setErrors(errs);
//     if (Object.keys(errs).length) return;

//     const payload = {
//       firstName: values.firstName.trim(),
//       lastName: values.lastName.trim(),
//       email: values.email.trim().toLowerCase(),
//       password: values.password,
//       role
//     };

//     if (role === 'client') {
//       payload.companyName = values.companyName.trim();
//     } else {
//       payload.headline = values.headline.trim();
//       payload.country = values.country.trim();
//     }

//     setSubmitting(true);
//     try {
//       const user = await register(payload);
//       toast.success('Account created');
//       const fallback =
//         user?.role === 'va'
//           ? '/va/profile'
//           : user?.role === 'admin'
//           ? '/admin/dashboard'
//           : '/client/profile';
//       navigate(fallback, { replace: true });
//     } catch (err) {
//       if (err.errors && Array.isArray(err.errors)) {
//         const mapped = {};
//         for (const e of err.errors) {
//           if (e.field) mapped[e.field] = e.message;
//         }
//         setErrors(mapped);
//       }
//       toast.error(err.message || 'Registration failed');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
//       <div className="w-full max-w-xl">
//         <div className="text-center mb-6">
//           <h1 className="text-2xl font-bold text-ink-900">{heading}</h1>
//           <p className="mt-2 text-sm text-ink-500">
//             Already have an account?{' '}
//             <Link to="/login" className="link">
//               Sign in
//             </Link>
//           </p>
//         </div>

//         <div className="mb-4 grid grid-cols-2 gap-2 p-1 bg-ink-100 rounded-xl">
//           <button
//             type="button"
//             onClick={() => setRole('client')}
//             className={`py-2 text-sm font-medium rounded-lg transition ${
//               role === 'client' ? 'bg-white shadow text-ink-900' : 'text-ink-600'
//             }`}
//           >
//             I'm hiring
//           </button>
//           <button
//             type="button"
//             onClick={() => setRole('va')}
//             className={`py-2 text-sm font-medium rounded-lg transition ${
//               role === 'va' ? 'bg-white shadow text-ink-900' : 'text-ink-600'
//             }`}
//           >
//             I'm a VA
//           </button>
//         </div>

//         <form onSubmit={onSubmit} className="card p-6 space-y-4" noValidate>
//           <div className="grid sm:grid-cols-2 gap-4">
//             <Input
//               label="First name"
//               name="firstName"
//               value={values.firstName}
//               onChange={onChange}
//               error={errors.firstName}
//               required
//             />
//             <Input
//               label="Last name"
//               name="lastName"
//               value={values.lastName}
//               onChange={onChange}
//               error={errors.lastName}
//               required
//             />
//           </div>
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
//           <div className="grid sm:grid-cols-2 gap-4">
//             <Input
//               label="Password"
//               name="password"
//               type="password"
//               autoComplete="new-password"
//               value={values.password}
//               onChange={onChange}
//               error={errors.password}
//               hint="Min 8 chars with at least one letter and one number"
//               required
//             />
//             <Input
//               label="Confirm password"
//               name="confirmPassword"
//               type="password"
//               autoComplete="new-password"
//               value={values.confirmPassword}
//               onChange={onChange}
//               error={errors.confirmPassword}
//               required
//             />
//           </div>

//           {role === 'client' && (
//             <Input
//               label="Company / store name"
//               name="companyName"
//               value={values.companyName}
//               onChange={onChange}
//               error={errors.companyName}
//               required
//             />
//           )}

//           {role === 'va' && (
//             <>
//               <Input
//                 label="Headline"
//                 name="headline"
//                 placeholder="Amazon listing specialist with 3+ years"
//                 value={values.headline}
//                 onChange={onChange}
//                 error={errors.headline}
//                 required
//               />
//               <Input
//                 label="Country"
//                 name="country"
//                 placeholder="Philippines"
//                 value={values.country}
//                 onChange={onChange}
//                 error={errors.country}
//                 required
//               />
//             </>
//           )}

//           <label className="flex items-start gap-3 text-sm text-ink-600">
//             <input
//               type="checkbox"
//               name="acceptTerms"
//               checked={values.acceptTerms}
//               onChange={onChange}
//               className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-600"
//             />
//             <span>
//               I agree to the{' '}
//               <Link to="/terms" className="link">
//                 Terms
//               </Link>{' '}
//               and{' '}
//               <Link to="/privacy" className="link">
//                 Privacy Policy
//               </Link>
//               .
//             </span>
//           </label>
//           {errors.acceptTerms && <p className="error-text">{errors.acceptTerms}</p>}

//           <Button type="submit" className="w-full" loading={submitting}>
//             Create account
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }



import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { validateRegister } from '../../utils/validators.js';

export default function Register() {
  const [params] = useSearchParams();
  const initialRole = params.get('role') === 'va' ? 'va' : 'client';
  const [role, setRole] = useState(initialRole);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    headline: '',
    country: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
    setErrors((x) => ({ ...x, [name]: undefined }));
  };

  const heading = useMemo(
    () => (role === 'va' ? 'Create your VA profile' : 'Create your client account'),
    [role]
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validateRegister(values, role);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
      role
    };

    if (role === 'client') {
      payload.companyName = values.companyName.trim();
    } else {
      payload.headline = values.headline.trim();
      payload.country = values.country.trim();
    }

    setSubmitting(true);
    try {
      const user = await register(payload);
      toast.success('Account created');
      const fallback =
        user?.role === 'va'
          ? '/va/profile'
          : user?.role === 'admin'
          ? '/admin/dashboard'
          : '/client/profile';
      navigate(fallback, { replace: true });
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        const mapped = {};
        for (const e of err.errors) {
          if (e.field) mapped[e.field] = e.message;
        }
        setErrors(mapped);
      }
      toast.error(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Form side */}
      <div className="flex items-center justify-center px-4 py-12 lg:px-12 order-2 lg:order-1">
        <div className="w-full max-w-xl animate-slide-up">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ink-900 tracking-tight">{heading}</h1>
            <p className="mt-2 text-sm text-ink-500">
              Already have an account?{' '}
              <Link to="/login" className="link">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-1 p-1 bg-ink-100 rounded-xl">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`py-2.5 text-sm font-semibold rounded-lg transition ${
                role === 'client'
                  ? 'bg-white shadow-soft text-ink-900'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              I'm hiring
            </button>
            <button
              type="button"
              onClick={() => setRole('va')}
              className={`py-2.5 text-sm font-semibold rounded-lg transition ${
                role === 'va'
                  ? 'bg-white shadow-soft text-ink-900'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              I'm a VA
            </button>
          </div>

          <form onSubmit={onSubmit} className="card p-6 space-y-4" noValidate>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="First name"
                name="firstName"
                value={values.firstName}
                onChange={onChange}
                error={errors.firstName}
                required
              />
              <Input
                label="Last name"
                name="lastName"
                value={values.lastName}
                onChange={onChange}
                error={errors.lastName}
                required
              />
            </div>
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={onChange}
              error={errors.email}
              required
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={values.password}
                onChange={onChange}
                error={errors.password}
                hint="Min 8 chars with at least one letter and one number"
                required
              />
              <Input
                label="Confirm password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={values.confirmPassword}
                onChange={onChange}
                error={errors.confirmPassword}
                required
              />
            </div>

            {role === 'client' && (
              <Input
                label="Company / store name"
                name="companyName"
                value={values.companyName}
                onChange={onChange}
                error={errors.companyName}
                required
              />
            )}

            {role === 'va' && (
              <>
                <Input
                  label="Headline"
                  name="headline"
                  placeholder="Amazon listing specialist with 3+ years"
                  value={values.headline}
                  onChange={onChange}
                  error={errors.headline}
                  required
                />
                <Input
                  label="Country"
                  name="country"
                  placeholder="Philippines"
                  value={values.country}
                  onChange={onChange}
                  error={errors.country}
                  required
                />
              </>
            )}

            <label className="flex items-start gap-3 text-sm text-ink-600 cursor-pointer">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={values.acceptTerms}
                onChange={onChange}
                className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500/30"
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" className="link">
                  Terms
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="link">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.acceptTerms && <p className="error-text">{errors.acceptTerms}</p>}

            <Button type="submit" className="w-full" loading={submitting} size="lg">
              Create account
            </Button>
          </form>
        </div>
      </div>

      {/* Brand side */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 btn-gradient" />
        <div className="absolute inset-0 bg-grid bg-grid opacity-20 mix-blend-overlay" />

        <div className="relative z-10 max-w-md px-8 text-white">
          <div className="inline-flex items-center gap-2.5 rounded-xl bg-white/10 border border-white/20 px-3 py-2 backdrop-blur-sm">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white text-brand-700 font-bold text-xs">
              EV
            </span>
            <span className="font-semibold text-sm">EcomVA Verify</span>
          </div>

          <h2 className="mt-8 text-4xl font-bold tracking-tight leading-tight">
            {role === 'va'
              ? 'Prove your skills. Get discovered.'
              : 'Find proven e-commerce talent.'}
          </h2>
          <p className="mt-4 opacity-90">
            {role === 'va'
              ? 'Take assessments, complete trial tasks, and build a performance record that clients trust.'
              : 'Post your requirement and get matched to VAs whose skills have actually been verified.'}
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { v: '10', k: 'Skill tracks' },
              { v: '100%', k: 'Real data' },
              { v: 'Free', k: 'To start' }
            ].map((s) => (
              <div key={s.k} className="rounded-xl bg-white/10 border border-white/20 p-3">
                <div className="text-xl font-bold">{s.v}</div>
                <div className="text-xs opacity-80 mt-0.5">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}