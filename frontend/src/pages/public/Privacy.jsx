export default function Privacy() {
  return (
    <div className="container-page py-16 max-w-3xl">
      <h1 className="text-4xl font-bold text-ink-900">Privacy Policy</h1>
      <p className="mt-4 text-ink-600">Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="mt-8 text-xl font-semibold text-ink-900">1. Data we collect</h2>
      <p className="mt-2 text-ink-700">
        Account information (name, email, hashed password), profile information (headline, country,
        timezone, skills, rate), activity data (requirements, assessments, tasks, reviews, messages),
        and technical data (IP address, browser, session information).
      </p>

      <h2 className="mt-6 text-xl font-semibold text-ink-900">2. How we use data</h2>
      <p className="mt-2 text-ink-700">
        To operate the platform, verify identity and skills, match clients with VAs, provide
        notifications and messaging, prevent fraud and abuse, and improve our services.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-ink-900">3. Sharing</h2>
      <p className="mt-2 text-ink-700">
        Public VA profile information is visible to clients and guests. Private messages,
        requirements, and trial submissions are only visible to the involved parties and platform
        administrators as required for moderation and support.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-ink-900">4. Security</h2>
      <p className="mt-2 text-ink-700">
        Passwords are hashed. Sessions use HTTP-only cookies. We apply input validation,
        authorization checks, and rate limiting to protect the platform.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-ink-900">5. Your rights</h2>
      <p className="mt-2 text-ink-700">
        You may access, correct, or delete your personal information through your account settings.
        You may also contact support to request data export or account deletion.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-ink-900">6. Cookies</h2>
      <p className="mt-2 text-ink-700">
        We use cookies solely for authentication and session management. We do not use third-party
        advertising cookies.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-ink-900">7. Contact</h2>
      <p className="mt-2 text-ink-700">
        For privacy questions, contact us through the contact page.
      </p>
    </div>
  );
}