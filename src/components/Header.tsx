import { Building2, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../lib/auth';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('home');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
          >
            <Building2 className="w-8 h-8 text-coral-400" />
            <div className="text-left">
              <h1 className="text-2xl font-bold tracking-tight">Locked In</h1>
              <p className="text-xs text-teal-100">GPS Attendance System</p>
            </div>
          </button>

          <nav className="hidden md:flex items-center space-x-6">
            <NavLink
              active={currentPage === 'home'}
              onClick={() => onNavigate('home')}
            >
              Home
            </NavLink>
            <NavLink
              active={currentPage === 'about'}
              onClick={() => onNavigate('about')}
            >
              About
            </NavLink>
            <NavLink
              active={currentPage === 'contact'}
              onClick={() => onNavigate('contact')}
            >
              Contact
            </NavLink>
            <NavLink
              active={currentPage === 'faq'}
              onClick={() => onNavigate('faq')}
            >
              FAQ
            </NavLink>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 bg-coral-500 hover:bg-coral-600 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-sm font-medium hover:text-teal-100 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-4 py-2 bg-coral-500 hover:bg-coral-600 rounded-lg text-sm font-medium transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-sm font-medium transition-colors ${
        active
          ? 'text-white border-b-2 border-coral-400 pb-1'
          : 'text-teal-100 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}
