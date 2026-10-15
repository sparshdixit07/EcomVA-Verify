import Card, { CardBody } from '../../components/ui/Card.jsx';

export default function About() {
  return (
    <div className="container-page py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-ink-900">About EcomVA Verify</h1>
      <p className="mt-4 text-lg text-ink-600">
        We exist to make hiring e-commerce Virtual Assistants a matter of evidence, not impression.
      </p>

      <div className="mt-10 space-y-6">
        <Card>
          <CardBody>
            <h2 className="text-xl font-bold text-ink-900">Our mission</h2>
            <p className="mt-3 text-ink-700">
              Generic freelance marketplaces optimise for volume. E-commerce store owners need
              specialists — people who actually understand how to build an Amazon listing, manage
              Shopify inventory, handle returns, and reply to customer support tickets.
            </p>
            <p className="mt-3 text-ink-700">
              We built EcomVA Verify so that hiring decisions are anchored on: verified skills,
              practical work simulations, real client reviews, and measurable post-hire performance.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-xl font-bold text-ink-900">What makes us different</h2>
            <ul className="mt-3 space-y-2 text-ink-700 list-disc pl-5">
              <li>E-commerce-specific assessments, not general tests.</li>
              <li>Practical trial tasks that produce real, reviewable work.</li>
              <li>A deterministic matching engine with transparent factor scores.</li>
              <li>Performance tracking tied to actual delivered tasks.</li>
              <li>Reviews restricted to real client-VA engagements.</li>
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-xl font-bold text-ink-900">Focus on Southeast Asia</h2>
            <p className="mt-3 text-ink-700">
              Southeast Asia is home to a deep, growing pool of experienced e-commerce virtual
              assistants. We focus our directory there so that store owners get VAs with strong
              platform familiarity, competitive pricing, and overlapping timezones.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}