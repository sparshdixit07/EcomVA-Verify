import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FullPageSpinner } from '../components/ui/Spinner.jsx';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, bootstrapped } = useAuth();
  const location = useLocation();

  if (loading || !bootstrapped) return <FullPageSpinner />;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

export default ProtectedRoute;