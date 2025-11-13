import { Calculator, FileText, TrendingUp, Calendar, Bell, LogOut, Home, Users, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import styles from './Dashboard.module.css';

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.logoIcon}>
              <Calculator className={styles.calcIcon} />
            </div>
            <div>
              <h1 className={styles.headerTitle}>P.S Kanodia & Co.</h1>
              <p className={styles.headerSubtitle}>Client Portal</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.notificationBtn}>
              <Bell className={styles.notificationIcon} />
              <span className={styles.notificationDot}></span>
            </button>
            <div className={styles.userSection}>
              <div className={styles.userInfo}>
                <p className={styles.userName}>Client Name</p>
                <p className={styles.userEmail}>client@example.com</p>
              </div>
              <button onClick={onLogout} className={styles.logoutBtn}>
                <LogOut className={styles.logoutIcon} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            <NavItem icon={<Home />} text="Dashboard" active />
            <NavItem icon={<FileText />} text="Documents" />
            <NavItem icon={<DollarSign />} text="Tax Returns" />
            <NavItem icon={<Users />} text="Services" />
            <NavItem icon={<Calendar />} text="Appointments" />
            <NavItem icon={<CheckCircle />} text="Compliance" />
          </nav>
        </aside>

        <main className={styles.main}>
          <div className={styles.welcomeSection}>
            <h2 className={styles.welcomeTitle}>Welcome Back, Client Name!</h2>
            <p className={styles.welcomeText}>Here's an overview of your financial status and pending tasks.</p>
          </div>

          <div className={styles.statsGrid}>
            <StatCard
              icon={<FileText />}
              label="Pending Documents"
              value="3"
              color="blue"
            />
            <StatCard
              icon={<Calendar />}
              label="Upcoming Deadlines"
              value="2"
              color="orange"
            />
            <StatCard
              icon={<CheckCircle />}
              label="Completed Tasks"
              value="12"
              color="green"
            />
            <StatCard
              icon={<AlertCircle />}
              label="Alerts"
              value="1"
              color="red"
            />
          </div>

          <div className={styles.tasksSection}>
            <h3 className={styles.sectionTitle}>Recent Tasks</h3>
            <div className={styles.tasksList}>
              <TaskItem
                title="Submit GST Returns"
                dueDate="Due: Jan 20, 2025"
                status="pending"
              />
              <TaskItem
                title="Review Financial Statements"
                dueDate="Due: Jan 25, 2025"
                status="pending"
              />
              <TaskItem
                title="Tax Filing Consultation"
                dueDate="Completed: Jan 10, 2025"
                status="completed"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, text, active = false }: { icon: React.ReactNode; text: string; active?: boolean }) {
  return (
    <div className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}>
      <span className={styles.navIcon}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className={`${styles.statCard} ${styles[`statCard${color.charAt(0).toUpperCase() + color.slice(1)}`]}`}>
      <div className={`${styles.statIcon} ${styles[`statIcon${color.charAt(0).toUpperCase() + color.slice(1)}`]}`}>
        {icon}
      </div>
      <div className={styles.statContent}>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue}>{value}</p>
      </div>
    </div>
  );
}

function TaskItem({ title, dueDate, status }: { title: string; dueDate: string; status: string }) {
  return (
    <div className={`${styles.taskItem} ${styles[`taskItem${status.charAt(0).toUpperCase() + status.slice(1)}`]}`}>
      <div className={styles.taskCheckbox}>
        {status === 'completed' && <CheckCircle className={styles.taskCheckIcon} />}
      </div>
      <div className={styles.taskContent}>
        <p className={styles.taskTitle}>{title}</p>
        <p className={styles.taskDate}>{dueDate}</p>
      </div>
      <div className={`${styles.taskStatus} ${styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`]}`}>
        {status === 'pending' ? 'Pending' : 'Completed'}
      </div>
    </div>
  );
}
