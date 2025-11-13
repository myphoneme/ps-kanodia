// icons removed as they were unused
import styles from './Header.module.css';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onLogin?: () => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  isLandingPage?: boolean;
  onNavigate?: (page: string) => void;
}

export default function Header({ onLogin, isLoggedIn, onLogout, onNavigate }: HeaderProps) {
  const navigate = useNavigate();
  const handleNavClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      if (page === 'landing') navigate('/');
      else navigate(`/${page}`);
    }
  };
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <button className={styles.logo} onClick={() => handleNavClick('landing')}>
            <div className={styles.logoIcon}>
              <img
              src="../../uploads/static/logo.png"
              width={45}
              height={45}
              alt="Logo"
/>
            </div>
            <div>
              <h1 className={styles.logoText}>P.S Kanodia & Co.</h1>
              <p className={styles.logoSubtext}>Chartered Accountants</p>
            </div>
          </button>

          <div className={styles.navLinks}>
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/services" className={styles.navLink}>Services</Link>
            <Link to="/about" className={styles.navLink}>About</Link>
            <Link to="/contact" className={styles.navLink}>Contact</Link>
            <Link to="/blog" className={styles.navLink}>Blog</Link>
          </div>

          <div className={styles.authButtons}>
            {!isLoggedIn ? (
              <button onClick={onLogin} className={styles.loginBtn}>
                Admin Login
              </button>
            ) : (
              <button onClick={onLogout} className={styles.logoutBtn}>
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
