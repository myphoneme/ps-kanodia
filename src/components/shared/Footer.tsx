import { Calculator } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <div className={styles.branding}>
              <div className={styles.logoIcon}>
                <Calculator className={styles.calculatorIcon} />
              </div>
              <div>
                <h4 className={styles.brandName}>P.S Kanodia & Co.</h4>
                <p className={styles.brandSubtext}>Chartered Accountants</p>
              </div>
            </div>
            <p className={styles.description}>
              Professional excellence in accounting, taxation, and financial services.
            </p>
          </div>

          <div className={styles.section}>
            <h5 className={styles.heading}>Quick Links</h5>
            <ul className={styles.links}>
              <li><a href="#home">Home</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h5 className={styles.heading}>Address</h5>
            <ul className={styles.links}>
              <li>SF-38, ANSAL FORTUNE ARCADE,</li>
              <li>Captain Vijyant Thapar Marg, K Block,</li>
              <li>Atta Market, Pocket E,</li>
              <li>Sector 18, Noida,</li>
              <li>Uttar Pradesh 201301</li>
            </ul>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.bottom}>
          <p>&copy; 2025 P.S Kanodia & Co. All rights reserved. | Chartered Accountants</p>
        </div>
      </div>
    </footer>
  );
}
