import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FullPageSpinner } from '../components/ui/Spinner.jsx';

export function RoleRoute({ roles, children }) {
  const { user, loading, bootstrapped, isAuthenticated } = useAuth();

  if (loading || !bootstrapped) return <FullPageSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) {
    const fallback =
      user.role === 'admin' ? '/admin/dashboard' : user.role === 'va' ? '/va/dashboard' : '/client/dashboard';
    return <Navigate to={fallback} replace />;
  }
  return children;
}

export default RoleRoute;