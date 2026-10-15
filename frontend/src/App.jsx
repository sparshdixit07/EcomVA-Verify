import { Suspense } from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import { FullPageSpinner } from './components/ui/Spinner.jsx';

export default function App() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <AppRoutes />
    </Suspense>
  );
}