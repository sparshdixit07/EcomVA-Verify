import { useState } from 'react';
import Input from '../../components/ui/Input.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Button from '../../components/ui/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { reportService } from '../../services/report.service.js';
import { isEmail } from '../../utils/validators.js';

export default function Contact() {
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const onChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    setErrors((x) => ({ ...x, [e.target.name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!values.name.trim()) errs.name = 'Name is required';
    if (!isEmail(values.email)) errs.email = 'Enter a valid email';
    if (!values.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await reportService.create({
        type: 'contact',
        subject: values.subject || 'Contact form',
        description: `${values.name} <${values.email}>: ${values.message}`
      });
      toast.success('Message received. We will get back to you shortly.');
      setValues({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      // If the endpoint requires auth, surface a graceful fallback.
      toast.error(
        err.message ||
          'Could not submit. Please sign in and use the in-app support form.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-16 max-w-2xl">
      <h1 className="text-4xl font-bold text-ink-900">Contact us</h1>
      <p className="mt-3 text-ink-600">
        Questions, feedback, or partnership inquiries? Send us a message.
      </p>

      <form onSubmit={onSubmit} className="card p-6 mt-8 space-y-4" noValidate>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Your name"
            name="name"
            value={values.name}
            onChange={onChange}
            error={errors.name}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={onChange}
            error={errors.email}
            required
          />
        </div>
        <Input
          label="Subject"
          name="subject"
          value={values.subject}
          onChange={onChange}
          hint="Optional"
        />
        <Textarea
          label="Message"
          name="message"
          rows={6}
          value={values.message}
          onChange={onChange}
          error={errors.message}
          required
        />
        <Button type="submit" loading={loading}>
          Send message
        </Button>
      </form>
    </div>
  );
}