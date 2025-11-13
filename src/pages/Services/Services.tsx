import { Calculator, FileText, Users, TrendingUp, Shield, CheckCircle } from 'lucide-react';
import styles from './Services.module.css';

const SERVICES = [
  {
    id: 1,
    icon: FileText,
    title: 'Taxation Services',
    description: 'Complete income tax, GST, and TDS filing with expert guidance on tax planning and optimization strategies.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
    features: ['Income Tax Filing', 'GST Compliance', 'TDS Management', 'Tax Planning'],
  },
  {
    id: 2,
    icon: Calculator,
    title: 'Accounting & Bookkeeping',
    description: 'Complete accounting solutions with financial statement preparation and bookkeeping for businesses of all sizes.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=500&h=300&fit=crop',
    features: ['Journal Entries', 'Financial Statements', 'Reconciliation', 'Ledger Management'],
  },
  {
    id: 3,
    icon: Shield,
    title: 'Audit & Assurance',
    description: 'Statutory audits, internal audits, and comprehensive assurance services ensuring full compliance.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    features: ['Statutory Audits', 'Internal Audits', 'Tax Audits', 'Risk Assessment'],
  },
  {
    id: 4,
    icon: TrendingUp,
    title: 'Financial Advisory',
    description: 'Strategic financial planning, investment advisory, and business consulting to drive growth.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
    features: ['Business Planning', 'Investment Advisory', 'Cost Analysis', 'Growth Strategy'],
  },
  {
    id: 5,
    icon: Users,
    title: 'Company Formation',
    description: 'Complete assistance in company registration, partnership formation, and regulatory compliance.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    features: ['Company Registration', 'Partnership Formation', 'LLP Setup', 'Legal Compliance'],
  },
  {
    id: 6,
    icon: CheckCircle,
    title: 'Compliance Services',
    description: 'ROC filings, annual returns, and complete regulatory compliance management for your business.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
    features: ['ROC Filings', 'Annual Returns', 'MCA Compliance', 'Regulatory Filing'],
  },
];

export default function Services() {
  return (
    <div className={styles.services}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>Our Services</h1>
          <p className={styles.subtitle}>Comprehensive financial solutions tailored to your business needs</p>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.servicesGrid}>
            {SERVICES.map(service => {
              const Icon = service.icon;
              return (
                <div key={service.id} className={styles.serviceCard}>
                  <div className={styles.cardImage}>
                    <img src={service.image} alt={service.title} />
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.iconBox}>
                      <Icon className={styles.icon} />
                    </div>
                    <h3 className={styles.serviceTitle}>{service.title}</h3>
                    <p className={styles.serviceDescription}>{service.description}</p>
                    <div className={styles.featuresList}>
                      {service.features.map((feature, idx) => (
                        <div key={idx} className={styles.feature}>
                          <CheckCircle className={styles.featureIcon} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <button className={styles.learnMore}>Learn More →</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.whyChoose}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Choose Us?</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefit}>
              <div className={styles.benefitNumber}>1</div>
              <h3 className={styles.benefitTitle}>Expert Team</h3>
              <p className={styles.benefitText}>Highly qualified chartered accountants with extensive industry experience</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitNumber}>2</div>
              <h3 className={styles.benefitTitle}>Personalized Service</h3>
              <p className={styles.benefitText}>Customized solutions tailored to your specific business requirements</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitNumber}>3</div>
              <h3 className={styles.benefitTitle}>Proactive Approach</h3>
              <p className={styles.benefitText}>We stay ahead of regulatory changes to protect your interests</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitNumber}>4</div>
              <h3 className={styles.benefitTitle}>Cost Effective</h3>
              <p className={styles.benefitText}>Transparent pricing with no hidden costs for our services</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitNumber}>5</div>
              <h3 className={styles.benefitTitle}>Timely Delivery</h3>
              <p className={styles.benefitText}>We ensure all deadlines are met with precision and accuracy</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitNumber}>6</div>
              <h3 className={styles.benefitTitle}>Client Support</h3>
              <p className={styles.benefitText}>Available 24/7 for your queries and financial concerns</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
