import { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import styles from './Contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className={styles.contact}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>We're here to help and answer any question you might have</p>
        </div>
      </section>

      <section className={styles.contactContent}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>
            <div className={styles.infoSection}>
              <h2 className={styles.sectionTitle}>Get In Touch</h2>

              <div className={styles.infoCard}>
                <div className={styles.iconBox}>
                  <Phone className={styles.icon} />
                </div>
                <div>
                  <h3 className={styles.infoTitle}>Phone</h3>
                  <p className={styles.infoText}>+91 98765 43210</p>
                  <p className={styles.infoText}>+91 98765 43211</p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.iconBox}>
                  <Mail className={styles.icon} />
                </div>
                <div>
                  <h3 className={styles.infoTitle}>Email</h3>
                  <p className={styles.infoText}>contact@pskanodia.com</p>
                  <p className={styles.infoText}>info@pskanodia.com</p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.iconBox}>
                  <MapPin className={styles.icon} />
                </div>
                <div>
                  <h3 className={styles.infoTitle}>Office Address</h3>
                  <p className={styles.infoText}>
                    123 Business District<br />
                    Financial Center<br />
                    Mumbai, Maharashtra 400001<br />
                    India
                  </p>
                </div>
              </div>

              <div className={styles.hoursCard}>
                <h3 className={styles.infoTitle}>Business Hours</h3>
                <div className={styles.hours}>
                  <div className={styles.hourItem}>
                    <span className={styles.day}>Monday - Friday</span>
                    <span className={styles.time}>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className={styles.hourItem}>
                    <span className={styles.day}>Saturday</span>
                    <span className={styles.time}>9:00 AM - 2:00 PM</span>
                  </div>
                  <div className={styles.hourItem}>
                    <span className={styles.day}>Sunday</span>
                    <span className={styles.time}>Closed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Send us a Message</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Your full name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="your@email.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  >
                    <option value="">Select a subject</option>
                    <option value="tax">Tax Services</option>
                    <option value="accounting">Accounting & Bookkeeping</option>
                    <option value="audit">Audit & Assurance</option>
                    <option value="advisory">Financial Advisory</option>
                    <option value="company">Company Formation</option>
                    <option value="compliance">Compliance Services</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={styles.textarea}
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button type="submit" className={styles.submitBtn}>
                  <Send className={styles.submitIcon} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Need immediate assistance?</h2>
          <p className={styles.ctaText}>Call us now at +91 98765 43210</p>
          <button className={styles.ctaBtn}>Schedule a Consultation</button>
        </div>
      </section>
    </div>
  );
}
