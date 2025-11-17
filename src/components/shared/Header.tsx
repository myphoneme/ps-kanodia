import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import styles from './Header.module.css';
import { Link, useNavigate } from 'react-router-dom';

// interface HeaderProps {
//   onLogin?: () => void;
//   isLoggedIn?: boolean;
//   onLogout?: () => void;
//   isLandingPage?: boolean;
//   onNavigate?: (page: string) => void;
// }

interface HeaderProps {
  onLogin?: () => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
}

export default function Header({ onLogin, isLoggedIn, onLogout, onNavigate }: HeaderProps) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (page: string) => {
    setIsMobileMenuOpen(false);
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
              <img src="/logo.png" width={42} height={42} alt="Logo" />
              {/* <img
              src="/logo.png"
              height={45}
              alt="Logo"
/> */}
{/* <img src="/logo.png" width={45} height={45} alt="Logo" /> */}


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

          <div className={styles.rightSection}>
            <div className={styles.authButtons}>
              {!isLoggedIn ? (
                <a onClick={onLogin} className={styles.loginBtn}>
                  Admin Login
                </a>
              ) : (
                <a onClick={onLogout} className={styles.logoutBtn}>
                  Logout
                </a>
              )}
            </div>

            <button
              className={styles.mobileMenuToggle}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className={styles.menuIcon} /> : <Menu className={styles.menuIcon} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <Link to="/" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/services" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
            <Link to="/about" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/contact" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            <Link to="/blog" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>

            {/* ---------- AUTH BUTTON (MOBILE ONLY) ---------- */}
            <div className={styles.mobileAuth}>
              {!isLoggedIn ? (
                <a onClick={() => { onLogin?.(); setIsMobileMenuOpen(false); }} className={styles.mobileNavLink}>
                  Admin Login
                </a>
              ) : (
                <a onClick={() => { onLogout?.(); setIsMobileMenuOpen(false); }} className={styles.mobileNavLink}>
                  Logout
                </a>
              )}
            </div>
            
          </div>
        )}
      </nav>
    </header>
  );
}
