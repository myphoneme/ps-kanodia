import { useState } from 'react';
import { Phone, Mail, Send, CheckCircle } from 'lucide-react';
import styles from './Contact.module.css';
import { insertContact } from '../../utils/contactsApi';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await insertContact({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err: any) {
      setError(err?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contact}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>Contact Us</h1>
          {/* <p className={styles.subtitle}>We're here to help and answer any question you might have</p> */}
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
                  <p className={styles.infoText}>+91 99900 18844</p>
                  {/* <p className={styles.infoText}>+91 98765 43211</p> */}
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.iconBox}>
                  <Mail className={styles.icon} />
                </div>
                <div>
                  <h3 className={styles.infoTitle}>Email</h3>
                  <p className={styles.infoText}>pskanodia@gmail.com</p>
                  {/* <p className={styles.infoText}>info@pskanodia.com</p> */}
                </div>
              </div>

              {/* <div className={styles.infoCard}>
                <div className={styles.iconBox}>
                  <MapPin className={styles.icon} />
                </div>
                <div>
                  <h3 className={styles.infoTitle}>Office Address</h3>
                  <p className={styles.infoText}>
                    P.S Kanodia & Co.<br />
                    SF-38, ANSAL FORTUNE ARCADE,<br/>
                    Captain Vijyant Thapar Marg, K Block<br /> 
                    Atta Market, Pocket E,<br />
                    Sector 18, Noida,<br />
                    Uttar Pradesh 201301
                  </p>
                </div>
              </div> */}

              <div className={styles.mapContainer}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.8923081678404!2d77.32162267549859!3d28.57299637569741!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce44f0d277d3d%3A0x28433f7d411732ab!2sP.S%20Kanodia%20%26%20Co.!5e0!3m2!1sen!2sin!4v1763016795698!5m2!1sen!2sin" 
                  width="600" 
                  height="450" 
                  style={{border:0}} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="P.S Kanodia & Co. Location"
                ></iframe>
              </div>

              {/* <div className={styles.hoursCard}>
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
              </div> */}
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Send us a Message</h2>
              {showSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 font-medium">Message sent successfully! We'll get back to you soon.</p>
                </div>
              )}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
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
                  <label className={styles.label}>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Subject"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={3}
                    className={styles.textarea}
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                  <Send className={styles.submitIcon} />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Need immediate assistance?</h2>
          <p className={styles.ctaText}>Call us now at +91 99900 18844</p>
          <button className={styles.ctaBtn}>Schedule a Consultation</button>
        </div>
      </section> */}
    </div>
  );
}
