import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Landing from './components/landing/Landing';
import AdminDashboard from './components/admin/AdminDashboard';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import About from './components/about/About';
import Services from './components/services/Services';
import Contact from './components/contact/Contact';
import Blog from './components/blog/Blog';
import BlogDetail from './components/BlogDetail/BlogDetail';
import { GlobalProvider } from './components/Context';
import LoginModal from './components/shared/LoginModal';
import { AuthUser } from './utils/auth';

function App() {
  return (
    <GlobalProvider>
      <AppContent />
    </GlobalProvider>
  );
}

function AppContent() {
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('pskAuthToken'));
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('pskAuthUser');
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('pskAuthToken'));
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const BlogDetailRoute = () => {
    // lazy import of useParams to avoid top-level dependency if not needed elsewhere
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useParams } = require('react-router-dom') as typeof import('react-router-dom');
    const params = useParams();
    return <BlogDetail blogId={(params as any)?.id || ''} onNavigate={navigateTo} />;
  };

  useEffect(() => {
    if (!authToken) {
      setIsLoggedIn(false);
      return;
    }
    setIsLoggedIn(true);
  }, [authToken]);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('pskAuthToken');
    localStorage.removeItem('pskAuthUser');
    navigate('/');
  };

  const navigateTo = (page: string) => {
    if (page.startsWith('blogDetail:')) {
      const id = page.split(':')[1];
      navigate(`/blog/${id}`);
    } else {
      if (page === 'landing') navigate('/');
      else navigate(`/${page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (token: string, user: AuthUser) => {
    setAuthToken(token);
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('pskAuthToken', token);
    localStorage.setItem('pskAuthUser', JSON.stringify(user));
    setShowLoginModal(false);
    navigate('/dashboard');
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* <Header
                onLogin={handleLoginClick}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                isLandingPage={true}
                onNavigate={navigateTo}
              /> */}
              <Landing
                onLogin={handleLoginClick}
                onNavigate={navigateTo}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
              />
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Header
                onLogin={handleLoginClick}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                isLandingPage={false}
                onNavigate={navigateTo}
              />
              <About />
              <Footer />
            </>
          }
        />
        <Route
          path="/services"
          element={
            <>
              <Header
                onLogin={handleLoginClick}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                isLandingPage={false}
                onNavigate={navigateTo}
              />
              <Services />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Header
                onLogin={handleLoginClick}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                isLandingPage={false}
                onNavigate={navigateTo}
              />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route
          path="/blog"
          element={
            <>
              <Header
                onLogin={handleLoginClick}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                isLandingPage={false}
                onNavigate={navigateTo}
              />
              <Blog isPrivate={isLoggedIn} isLoggedIn={isLoggedIn} onNavigate={navigateTo} />
              <Footer />
            </>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <>
              <Header
                onLogin={handleLoginClick}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                isLandingPage={false}
                onNavigate={navigateTo}
              />
              <BlogDetailRoute />
              <Footer />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn && authToken ? (
              <AdminDashboard onLogout={handleLogout} authToken={authToken} currentUser={currentUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} onSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;
