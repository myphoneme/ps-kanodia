import { Calculator, FileText, Users, TrendingUp, Shield, CheckCircle } from 'lucide-react';
import styles from './Services.module.css';

const SERVICES = [
  {
    id: 1,
    icon: Shield,
    title: 'Audit & Assurance',
    // description: 'Statutory audits, internal audits, and comprehensive assurance services ensuring full compliance.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    features: ['Statutory Audits of PSU, Banks and Others','Tax Audits','Internal Audits','Stock and Receivable Audits','Revenue and Concurrent Audit of Banks','Inspection and Investigation Audits','Reviews and Compilations and attestation services','Establishing and Reviewing Internal Control Systems','Defining Standard Operations Processes'],
  },
  {
    id: 2,
    icon: FileText,
    title: 'Tax and Litigation Support',
    // description: 'Complete income tax, GST, and TDS filing with expert guidance on tax planning and optimization strategies.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
    features: [' Domestic Tax Planning and Consultancy', 'Tax administrations including submission of tax returns', 'Assessment proceedings', 'Search, Seizure and Survey proceedings', 'Income Tax Appellate & ITAT'],
  }
  ,
  {
    id: 3,
    icon: FileText,
    title: 'International Tax',
    // description: 'Complete income tax, GST, and TDS filing with expert guidance on tax planning and optimization strategies.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
    features: ['International Tax Planning and Consultancy', 'Consultancy on Double Tax Avoidance Agreement'],
  },
  {
    id: 4,
    icon: TrendingUp,
    title: 'Indirect Tax',
    // description: 'Strategic financial planning, investment advisory, and business consulting to drive growth.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
    features: ['GST advisory and Compliance Services','Custom related advisory Services'],
  },
  {
    id: 5,
    icon: Users,
    title: 'Corporate and Other Laws',
    // description: 'Complete assistance in company registration, partnership formation, and regulatory compliance.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    features: ['Incorporation of Companies & LLP','Statutory Due Diligence Reviews','FEMA and RBI Compliance on FDI','Section 8 Companies, Producer Companies','NGO’s and Electoral Trust','Societies'],
  },
  {
    id: 6,
    icon: CheckCircle,
    title: 'Corporate Financing : Fund Raising',
    // description: 'ROC filings, annual returns, and complete regulatory compliance management for your business.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
    features: ['Preparing company for fund raising','Advice on business plan and projections','Access to the right debt and equity providers','Integrate tax structuring','Project finance'],
  },
  {
    id: 7,
    icon: CheckCircle,
    title: 'Corporate Financing : Valuation',
    // description: 'ROC filings, annual returns, and complete regulatory compliance management for your business.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
    features: ['Business','Regulatory','Intangible assets','IFRS'],
  },
];

interface ServicesProps {
  onNavigate?: (page: string) => void;
}

export default function Services({ onNavigate }: ServicesProps) {
  return (
    <div className={styles.services}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>Our Services</h1>
          {/* <p className={styles.subtitle}>Comprehensive financial solutions tailored to your business needs</p> */}
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
                    {/* <button className={styles.learnMore}>Learn More →</button> */}
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
