import Button from '../../components/ui/Button.jsx';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl">🧭</div>
        <h1 className="mt-4 text-3xl font-bold text-ink-900">Page not found</h1>
        <p className="mt-2 text-ink-600">The page you are looking for doesn't exist.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button to="/">Go home</Button>
          <Button variant="secondary" to="/find-vas">
            Find VAs
          </Button>
        </div>
      </div>
    </div>
  );
}