import { ChevronRight, FileText, Calculator, Shield, TrendingUp, Users, CheckCircle } from 'lucide-react';
import Header from './shared/Header';
import Footer from './shared/Footer';
import styles from './LandingPage.module.css';
import BlogList from '../pages/Blog/BlogList';

interface LandingPageProps {
  onLogin: () => void;
}

const SERVICES = [
  {
    icon: FileText,
    title: 'Taxation Services',
    description: 'Income tax, GST, TDS filing and compliance with expert guidance.',
  },
  {
    icon: Calculator,
    title: 'Accounting & Bookkeeping',
    description: 'Complete accounting solutions and financial statement preparation.',
  },
  {
    icon: Shield,
    title: 'Audit & Assurance',
    description: 'Statutory audits, internal audits, and comprehensive assurance services.',
  },
  {
    icon: TrendingUp,
    title: 'Financial Advisory',
    description: 'Strategic financial planning and investment advisory services.',
  },
  {
    icon: Users,
    title: 'Company Formation',
    description: 'Complete assistance in company registration and compliance.',
  },
  {
    icon: CheckCircle,
    title: 'Compliance Services',
    description: 'ROC filings, annual returns, and regulatory compliance management.',
  },
];

export default function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <div className={styles.landingPage}>
      <Header onLogin={onLogin} isLandingPage={true} />

      <section id="home" className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>Expert Financial & Tax Solutions for Your Business</h2>
            <p className={styles.heroDescription}>
              Trusted chartered accountants providing comprehensive accounting, taxation, audit, and advisory services with excellence and integrity.
            </p>
            <div className={styles.heroButtons}>
              <button onClick={onLogin} className={styles.primaryBtn}>
                Get Started
                <ChevronRight className={styles.btnIcon} />
              </button>
              <a href="#contact" className={styles.secondaryBtn}>
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Our Services</h3>
            <p className={styles.sectionSubtitle}>Comprehensive financial solutions tailored to meet your business needs</p>
          </div>
          <div className={styles.servicesGrid}>
            {SERVICES.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div key={idx} className={styles.serviceCard}>
                  <div className={styles.serviceIconBox}>
                    <Icon className={styles.serviceIcon} />
                  </div>
                  <h4 className={styles.serviceTitle}>{service.title}</h4>
                  <p className={styles.serviceDescription}>{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="about" className={styles.aboutSection}>
        <div className={styles.container}>
          <div className={styles.aboutContent}>
            <h3 className={styles.sectionTitle}>About P.S Kanodia & Co.</h3>
            <div className={styles.aboutBox}>
              <p className={styles.aboutText}>
                P.S Kanodia & Co. is a firm of Chartered Accountants committed to providing professional excellence in accounting, taxation, audit, and financial advisory services. With years of experience and a team of qualified professionals, we serve clients across various industries.
              </p>
              <p className={styles.aboutText}>
                Our approach combines technical expertise with personalized service, ensuring that each client receives solutions tailored to their specific business needs. We stay updated with the latest regulations and best practices to deliver value-added services.
              </p>
              <div className={styles.statsGrid}>
                <div className={styles.stat}>
                  <div className={styles.statValue}>500+</div>
                  <div className={styles.statLabel}>Happy Clients</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statValue}>15+</div>
                  <div className={styles.statLabel}>Years Experience</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statValue}>98%</div>
                  <div className={styles.statLabel}>Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="blog" className={styles.blogSection}>
        <div className={styles.blogHeader}>
          <div className={styles.container}>
            <h3 className={styles.sectionTitle}>Latest Blog Articles</h3>
            <p className={styles.sectionSubtitle}>Professional insights on accounting, taxation, and finance</p>
          </div>
        </div>
        <BlogList isPrivate={false} isLoggedIn={false} />
      </section>
      
      <section id="contact" className={styles.contactSection}>
        <div className={styles.container}>
          <h3 className={styles.sectionTitle}>Contact Us</h3>
          <div className={styles.contactGrid}>
            <div>
              <h4 className={styles.contactTitle}>Get In Touch</h4>
              <div className={styles.contactInfo}>
                <div className={styles.infoItem}>
                  <strong>Phone:</strong>
                  <p>+91 98765 43210<br />+91 99900 18844</p>
                </div>
                <div className={styles.infoItem}>
                  <strong>Email:</strong>
                  <p>pskanodia@gmail.com<br />info@pskanodia.com</p>
                </div>
                <div className={styles.infoItem}>
                  <strong>Address:</strong>
                  <p>123 Business District<br />Financial Center<br />Mumbai, Maharashtra 400001</p>
                </div>
              </div>
            </div>
            <div>
              <form className={styles.contactForm} onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Your name" className={styles.formInput} />
                <input type="email" placeholder="your@email.com" className={styles.formInput} />
                <textarea placeholder="How can we help you?" rows={4} className={styles.formTextarea}></textarea>
                <button type="submit" className={styles.formBtn}>Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
