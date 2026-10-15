import Button from './Button.jsx';

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="h-14 w-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl">
        !
      </div>
      <h3 className="mt-4 font-semibold text-ink-900">{title}</h3>
      {message && <p className="mt-1 text-sm text-ink-500 max-w-md">{message}</p>}
      {onRetry && (
        <div className="mt-5">
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}

export default ErrorState;