import styles from './About.module.css';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'P.S Kanodia',
    role: 'Founder & Managing Partner',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    description: 'Senior CA with 20+ years of experience in taxation and audit',
  },
  {
    id: 2,
    name: 'Arun Sharma',
    role: 'Senior Accountant',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    description: 'Expert in GST compliance and corporate tax planning',
  },
  {
    id: 3,
    name: 'Priya Singh',
    role: 'Financial Advisor',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    description: 'Specializes in financial planning and investment advisory',
  },
  {
    id: 4,
    name: 'Rajesh Kumar',
    role: 'Audit Manager',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    description: 'Expert in statutory and internal audits',
  },
];

const ACHIEVEMENTS = [
  { value: '500+', label: 'Happy Clients' },
  { value: '15+', label: 'Years Experience' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '50+', label: 'Team Members' },
];

const CERTIFICATIONS = [
  'Chartered Accountant (CA)',
  'GST Registration & Compliance',
  'ISO 9001:2015 Certified',
  'NISM Registered',
];

export default function About() {
  return (
    <div className={styles.about}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>About P.S Kanodia & Co.</h1>
          <p className={styles.subtitle}>Leading Chartered Accountants Serving Business Excellence</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.textContent}>
              <h2 className={styles.sectionTitle}>Our Story</h2>
              <p className={styles.paragraph}>
                P.S Kanodia & Co. was established in 2010 with a vision to provide comprehensive and professional accounting, taxation, and financial advisory services to businesses across diverse industries. Our journey has been marked by consistent growth, client satisfaction, and a commitment to excellence.
              </p>
              <p className={styles.paragraph}>
                With a team of experienced chartered accountants and financial professionals, we have successfully served over 500 clients ranging from startups to established corporations. Our expertise spans across multiple sectors including manufacturing, IT, healthcare, retail, and services.
              </p>
            </div>
            <div className={styles.imageContent}>
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop"
                alt="Office"
                className={styles.image}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.achievements}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Achievements</h2>
          <div className={styles.achievementGrid}>
            {ACHIEVEMENTS.map(achievement => (
              <div key={achievement.label} className={styles.achievementCard}>
                <div className={styles.achievementValue}>{achievement.value}</div>
                <div className={styles.achievementLabel}>{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Team</h2>
          <div className={styles.teamGrid}>
            {TEAM_MEMBERS.map(member => (
              <div key={member.id} className={styles.teamCard}>
                <img src={member.image} alt={member.name} className={styles.teamImage} />
                <div className={styles.teamInfo}>
                  <h3 className={styles.teamName}>{member.name}</h3>
                  <p className={styles.teamRole}>{member.role}</p>
                  <p className={styles.teamDescription}>{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.certifications}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Certifications & Credentials</h2>
          <div className={styles.certGrid}>
            {CERTIFICATIONS.map(cert => (
              <div key={cert} className={styles.certCard}>
                <div className={styles.certCheckmark}>✓</div>
                <p className={styles.certText}>{cert}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.mission}>
        <div className={styles.container}>
          <div className={styles.missionContent}>
            <div>
              <h3 className={styles.missionTitle}>Our Mission</h3>
              <p className={styles.missionText}>
                To deliver professional excellence in accounting, taxation, and financial advisory services while building long-term relationships with our clients through integrity, innovation, and expertise.
              </p>
            </div>
            <div>
              <h3 className={styles.missionTitle}>Our Vision</h3>
              <p className={styles.missionText}>
                To be the most trusted and preferred choice for financial and accounting services, recognized for our professionalism, client-centric approach, and commitment to business success.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
