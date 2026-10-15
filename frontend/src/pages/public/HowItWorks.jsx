import Card, { CardBody } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';

export default function HowItWorks() {
  return (
    <div className="container-page py-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-ink-900">How EcomVA Verify works</h1>
        <p className="mt-4 text-lg text-ink-600">
          A hiring workflow designed for e-commerce work — not generic freelancing.
        </p>
      </div>

      <div className="mt-12 grid lg:grid-cols-2 gap-8">
        <Card>
          <CardBody>
            <h2 className="text-xl font-bold text-ink-900">For clients</h2>
            <ol className="mt-5 space-y-4 text-sm text-ink-700">
              <li>
                <strong>1. Register and set up your store profile.</strong> Add platform (Amazon/Shopify),
                categories, and hiring preferences.
              </li>
              <li>
                <strong>2. Post a requirement.</strong> Title, description, required skills, English
                level, availability, timezone, budget range.
              </li>
              <li>
                <strong>3. Get ranked matches.</strong> Our deterministic engine returns a match
                score with per-factor breakdown and reasons.
              </li>
              <li>
                <strong>4. Compare and shortlist.</strong> Compare 2–3 VAs and save the best.
              </li>
              <li>
                <strong>5. Run a practical trial task.</strong> Assign a real work item, review the
                submission, and score it.
              </li>
              <li>
                <strong>6. Hire.</strong> Send a hiring request, manage tasks, track performance, and
                leave a review.
              </li>
            </ol>
            <div className="mt-6">
              <Button to="/register">Start hiring</Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-xl font-bold text-ink-900">For Virtual Assistants</h2>
            <ol className="mt-5 space-y-4 text-sm text-ink-700">
              <li>
                <strong>1. Register and complete your profile.</strong> Headline, country, timezone,
                languages, rate, availability.
              </li>
              <li>
                <strong>2. Add your e-commerce skills.</strong> Listing, store management, customer
                support, inventory, returns.
              </li>
              <li>
                <strong>3. Take assessments.</strong> Multiple-choice questions. Scores are stored and
                displayed as Verified Skill.
              </li>
              <li>
                <strong>4. Get verified.</strong> Admin reviews your verification request.
              </li>
              <li>
                <strong>5. Receive trial tasks.</strong> Accept, submit real work, get scored.
              </li>
              <li>
                <strong>6. Get hired.</strong> Accept a hiring request, receive tasks, build
                performance history.
              </li>
            </ol>
            <div className="mt-6">
              <Button to="/register?role=va">Create VA profile</Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        {[
          {
            t: 'Verified skills',
            d: 'Assessment scores stored as Verified Skill: 94/100.'
          },
          {
            t: 'Practical work simulation',
            d: 'Real work created by client → submitted by VA → scored by client.'
          },
          {
            t: 'Deterministic matching',
            d: 'Platform, skills, experience, English, availability, timezone, budget, scores.'
          }
        ].map((x) => (
          <Card key={x.t}>
            <CardBody>
              <div className="font-semibold text-ink-900">{x.t}</div>
              <div className="mt-2 text-sm text-ink-600">{x.d}</div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}