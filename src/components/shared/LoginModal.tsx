import { useState } from 'react';
import styles from './LoginModal.module.css';
import { login, AuthUser } from '../../utils/auth';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: (token: string, user: AuthUser) => void;
}

export default function LoginModal({ onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { token, user } = await login(email.trim(), password);
      onSuccess(token, user);
    } catch (err: any) {
      setError(err?.message || 'Unable to login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Admin Login</h2>
          <p className={styles.subtitle}>Sign in with your administrator credentials to access the dashboard.</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.secondaryButton} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

