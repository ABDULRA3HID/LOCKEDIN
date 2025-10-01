import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { SignUpPage } from './pages/SignUpPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { CheckInPage } from './pages/CheckInPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('home');
  const [params, setParams] = useState<any>({});

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const [route, ...rest] = hash.split('/');
      if (route === 'checkin' && rest[0]) {
        setPage('checkin');
        setParams({ token: rest[0] });
      } else if (route) {
        setPage(route);
      }
    }
  }, []);

  const handleNavigate = (newPage: string, newParams?: any) => {
    setPage(newPage);
    setParams(newParams || {});
    window.location.hash = newPage;
    window.scrollTo(0, 0);
  };

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

  if (page === 'checkin' && params.token) {
    return <CheckInPage token={params.token} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavigate={handleNavigate} currentPage={page} />
      <main className="flex-1">
        {page === 'home' && <HomePage onNavigate={handleNavigate} />}
        {page === 'about' && <AboutPage />}
        {page === 'contact' && <ContactPage />}
        {page === 'faq' && <FAQPage />}
        {page === 'terms' && <TermsPage />}
        {page === 'privacy' && <PrivacyPage />}
        {page === 'signup' && <SignUpPage onNavigate={handleNavigate} />}
        {page === 'login' && <LoginPage onNavigate={handleNavigate} />}
        {page === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
        {page === 'event-detail' && params.eventId && (
          <EventDetailPage
            eventId={params.eventId}
            onNavigate={handleNavigate}
          />
        )}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
