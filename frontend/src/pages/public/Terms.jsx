export default function Terms() {
  return (
    <div className="container-page py-16 max-w-3xl prose prose-ink">
      <h1 className="text-4xl font-bold text-ink-900">Terms of Service</h1>
      <p className="mt-4 text-ink-600">Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="mt-8 text-xl font-semibold text-ink-900">1. Acceptance of terms</h2>
      <p className="mt-2 text-ink-700">
        By accessing or using EcomVA Verify, you agree to be bound by these terms. If you do not
        agree, do not use the platform.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-ink-900">2. Accounts</h2>
      <p className="mt-2 text-ink-700">
        You must provide accurate information when creating an account. You are responsible for
        maintaining the confidentiality of your credentials and for all activities that occur under
        your account.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-ink-900">3. Client and VA responsibilities</h2>
      <p className="mt-2 text-ink-700">
        Clients must post truthful requirements and compensate VAs for work performed. VAs must
        represent their skills honestly, submit their own work for assessments and trial tasks, and
        meet agreed deadlines.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-ink-900">4. Assessments and verification</h2>
      <p className="mt-2 text-ink-700">
        Assessment results and verification badges reflect performance at the time of evaluation and
        do not constitute a guarantee of future results.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-ink-900">5. Reviews</h2>
      <p className="mt-2 text-ink-700">
        Only clients with an existing engagement with a VA may post a review. Reviews must be honest
        and not contain offensive, defamatory, or misleading content. We reserve the right to remove
        reviews that violate these terms.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-ink-900">6. Prohibited conduct</h2>
      <p className="mt-2 text-ink-700">
        You may not use the platform for illegal, fraudulent, or harmful purposes, harass other
        users, circumvent fees, or attempt to compromise platform security.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-ink-900">7. Suspension and termination</h2>
      <p className="mt-2 text-ink-700">
        We may suspend or terminate accounts that violate these terms or applicable law, with or
        without notice.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-ink-900">8. Limitation of liability</h2>
      <p className="mt-2 text-ink-700">
        EcomVA Verify is provided "as is". We are not liable for indirect, incidental, or
        consequential damages arising from use of the platform.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-ink-900">9. Changes</h2>
      <p className="mt-2 text-ink-700">
        We may update these terms from time to time. Continued use after changes constitutes
        acceptance of the updated terms.
      </p>
    </div>
  );
}