import { useAuth } from '../contexts/AuthContext';
import { LeadDashboard } from '../components/LeadDashboard';
import { FollowerDashboard } from '../components/FollowerDashboard';

interface DashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    onNavigate('login');
    return null;
  }

  if (user.role === 'lead' || user.role === 'institution_admin') {
    return <LeadDashboard onNavigate={onNavigate} />;
  }

  if (user.role === 'follower') {
    return <FollowerDashboard onNavigate={onNavigate} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Invalid user role</p>
      </div>
    </div>
  );
}
