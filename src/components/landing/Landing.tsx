import { ChevronRight, FileText, Calculator, Shield, TrendingUp, Users, CheckCircle, Clock, Tag, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import Header from '../shared/Header';
// import Footer from '../shared/Footer';
import styles from './Landing.module.css';
import { insertContact } from '../../utils/contactsApi';
import { FlashMessage } from '../../FlashMessage';

interface ApiBlogPost {
  id: number;
  title: string;
  post: string;
  image: string;
  category: { id: number; category_name: string };
  created_user: { id: number; name: string };
  created_at: string;
  updated_at: string;
}

interface LandingProps {
  onLogin: () => void;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  onLogout?: () => void;
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

export default function Landing({ onLogin, onNavigate, isLoggedIn, onLogout }: LandingProps) {
  const [blogs, setBlogs] = useState<ApiBlogPost[]>([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [flash, setFlash] = useState({ message: '', type: '' as 'add' | 'update' | 'delete' | 'error' | 'info' | '' });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://fastapi.phoneme.in/posts');
        if (response.ok) {
          const data = await response.json();
          const sortedBlogs = data.sort((a: ApiBlogPost, b: ApiBlogPost) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setBlogs(sortedBlogs.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlash({ message: '', type: '' });
    setIsSubmittingContact(true);
    try {
      await insertContact({
        name: contactForm.name,
        email: contactForm.email,
        subject: contactForm.subject || 'General Inquiry',
        message: contactForm.message,
      });
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setFlash({ message: 'Thank you for contacting us! We will get back to you soon.', type: 'add' });
    } catch (error: any) {
      setFlash({ message: error?.message || 'Failed to send your message. Please try again.', type: 'error' });
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <div className={styles.landingPage}>
      <FlashMessage
        message={flash.message}
        type={flash.type}
        onClose={() => setFlash({ message: '', type: '' })}
      />
      <Header onLogin={onLogin} isLoggedIn={isLoggedIn} onLogout={onLogout} isLandingPage={true} onNavigate={onNavigate} />

      <section className={styles.hero}>
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
              <button onClick={() => onNavigate('contact')} className={styles.secondaryBtn}>
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.servicesSection}>
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

      <section className={styles.aboutSection}>
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
                  <div className={styles.statValue}>25+</div>
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

      <section className={styles.blogSection}>
        <div className={styles.container}>
          <div className={styles.blogHeader}>
            <h3 className={styles.sectionTitle}>Latest Blog Articles</h3>
            <p className={styles.sectionSubtitle}>Professional insights on accounting, taxation, and finance</p>
          </div>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <p>Loading latest articles...</p>
            </div>
          ) : blogs.length > 0 ? (
            <div className={styles.blogsGrid}>
              {blogs.map(blog => {
                const excerpt = blog.post.replace(/<[^>]+>/g, '').slice(0, 150) + '...';
                return (
                  <article key={blog.id} className={styles.blogCard}>
                    <div className={styles.blogImage}>
                      <img
                        src={`https://fastapi.phoneme.in/${blog.image}`}
                        alt={blog.title}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=600&h=400&fit=crop';
                        }}
                      />
                    </div>
                    <div className={styles.blogContent}>
                      <div className={styles.meta}>
                        <span className={styles.date}>
                          <Clock className={styles.metaIcon} />
                          {new Date(blog.created_at).toLocaleDateString()}
                        </span>
                        <span className={styles.category}>
                          <Tag className={styles.metaIcon} />
                          {blog.category.category_name}
                        </span>
                      </div>
                      <h2 className={styles.blogTitle}>{blog.title}</h2>
                      <p className={styles.blogExcerpt}>{excerpt}</p>
                      <div className={styles.metaAuthor}>
                        <User className={styles.metaIcon} />
                        {blog.created_user.name}
                      </div>
                      <button
                        onClick={() => onNavigate(`blogDetail:${blog.id}`)}
                        className={styles.readMore}
                      >
                        Read More →
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyContainer}>
              <p>No articles available at the moment.</p>
            </div>
          )}
          <div className={styles.viewAllBlogs}>
            <button onClick={() => onNavigate('blog')} className={styles.viewAllBtn}>View All Articles</button>
          </div>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.container}>
          <h3 className={styles.sectionTitle}>Contact Us</h3>
          <div className={styles.contactGrid}>
            <div>
              <h4 className={styles.contactTitle}>Get In Touch</h4>
              <div className={styles.contactInfo}>
                <div className={styles.infoItem}>
                  <strong>Phone:</strong>
                  <p>+91 99900 18844</p>
                </div>
                <div className={styles.infoItem}>
                  <strong>Email:</strong>
                  <p>pskanodia@gmail.com</p>
                </div>
                <div className={styles.infoItem}>
                  <strong>Address:</strong>
                  <p>SF-38, ANSAL FORTUNE ARCADE,<br/>K Block, Sector 18, Noida,<br /> Uttar Pradesh - 201301</p>
                </div>
              </div>
            </div>
            <div>
              <form className={styles.contactForm} onSubmit={handleContactSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  className={styles.formInput}
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  className={styles.formInput}
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  className={styles.formInput}
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  required
                />
                <textarea
                  name="message"
                  placeholder="How can we help you?"
                  rows={4}
                  className={styles.formTextarea}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                ></textarea>
                <button type="submit" className={styles.formBtn} disabled={isSubmittingContact}>
                  {isSubmittingContact ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
}
