import { Calculator, FileText, TrendingUp, Calendar, Bell, Search, LogOut, Home, Users, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">P.S Kanodia & Co.</h1>
                <p className="text-xs text-gray-600">Client Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">Client Name</p>
                  <p className="text-xs text-gray-600">client@example.com</p>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white min-h-screen border-r border-gray-200 p-6">
          <nav className="space-y-2">
            <NavItem icon={<Home className="w-5 h-5" />} text="Dashboard" active />
            <NavItem icon={<FileText className="w-5 h-5" />} text="Documents" />
            <NavItem icon={<DollarSign className="w-5 h-5" />} text="Tax Returns" />
            <NavItem icon={<TrendingUp className="w-5 h-5" />} text="Financial Reports" />
            <NavItem icon={<Calendar className="w-5 h-5" />} text="Appointments" />
            <NavItem icon={<Users className="w-5 h-5" />} text="Support" />
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
            <p className="text-gray-600">Here's your financial overview and recent activity</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<FileText className="w-6 h-6" />}
              title="Total Documents"
              value="24"
              change="+3 this month"
              trend="up"
              color="blue"
            />
            <StatCard
              icon={<CheckCircle className="w-6 h-6" />}
              title="Completed Tasks"
              value="18"
              change="6 pending"
              trend="neutral"
              color="green"
            />
            <StatCard
              icon={<Calendar className="w-6 h-6" />}
              title="Upcoming Deadlines"
              value="5"
              change="Next: GST Filing"
              trend="down"
              color="orange"
            />
            <StatCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Outstanding Amount"
              value="₹0"
              change="All cleared"
              trend="up"
              color="purple"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
              </div>
              <div className="space-y-4">
                <ActivityItem
                  icon={<FileText className="w-5 h-5 text-blue-600" />}
                  title="Tax Return Filed - FY 2023-24"
                  time="2 days ago"
                  status="completed"
                />
                <ActivityItem
                  icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                  title="GST Return - March 2025"
                  time="5 days ago"
                  status="completed"
                />
                <ActivityItem
                  icon={<Clock className="w-5 h-5 text-orange-600" />}
                  title="Audit Report Review"
                  time="1 week ago"
                  status="pending"
                />
                <ActivityItem
                  icon={<FileText className="w-5 h-5 text-blue-600" />}
                  title="Financial Statement Q4"
                  time="2 weeks ago"
                  status="completed"
                />
                <ActivityItem
                  icon={<DollarSign className="w-5 h-5 text-purple-600" />}
                  title="Investment Advisory Consultation"
                  time="3 weeks ago"
                  status="completed"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Deadlines</h3>
              <div className="space-y-4">
                <DeadlineItem
                  title="GST Filing - April"
                  date="Apr 20, 2025"
                  priority="high"
                />
                <DeadlineItem
                  title="TDS Return Q4"
                  date="Apr 30, 2025"
                  priority="high"
                />
                <DeadlineItem
                  title="Income Tax Advance Payment"
                  date="Jun 15, 2025"
                  priority="medium"
                />
                <DeadlineItem
                  title="Annual ROC Filing"
                  date="Sep 30, 2025"
                  priority="low"
                />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <QuickActionButton
                  icon={<FileText className="w-5 h-5" />}
                  text="Upload Document"
                />
                <QuickActionButton
                  icon={<Calendar className="w-5 h-5" />}
                  text="Book Appointment"
                />
                <QuickActionButton
                  icon={<Search className="w-5 h-5" />}
                  text="Search Records"
                />
                <QuickActionButton
                  icon={<Users className="w-5 h-5" />}
                  text="Contact Support"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Services Overview</h3>
              <div className="space-y-3">
                <ServiceProgress
                  service="Tax Planning"
                  status="Active"
                  color="green"
                />
                <ServiceProgress
                  service="Accounting Services"
                  status="Active"
                  color="green"
                />
                <ServiceProgress
                  service="Audit Services"
                  status="Scheduled"
                  color="blue"
                />
                <ServiceProgress
                  service="GST Compliance"
                  status="Active"
                  color="green"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}

function NavItem({ icon, text, active }: NavItemProps) {
  return (
    <button
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
        active
          ? 'bg-blue-50 text-blue-600 font-medium'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: 'blue' | 'green' | 'orange' | 'purple';
}

function StatCard({ icon, title, value, change, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{change}</p>
    </div>
  );
}

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  time: string;
  status: 'completed' | 'pending';
}

function ActivityItem({ icon, title, time, status }: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="bg-white p-2 rounded-lg shadow-sm">
          {icon}
        </div>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
      </div>
      <span
        className={`text-xs font-medium px-3 py-1 rounded-full ${
          status === 'completed'
            ? 'bg-green-100 text-green-700'
            : 'bg-orange-100 text-orange-700'
        }`}
      >
        {status === 'completed' ? 'Completed' : 'Pending'}
      </span>
    </div>
  );
}

interface DeadlineItemProps {
  title: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

function DeadlineItem({ title, date, priority }: DeadlineItemProps) {
  const priorityConfig = {
    high: { color: 'bg-red-100 text-red-700', icon: <AlertCircle className="w-4 h-4" /> },
    medium: { color: 'bg-orange-100 text-orange-700', icon: <Clock className="w-4 h-4" /> },
    low: { color: 'bg-blue-100 text-blue-700', icon: <Calendar className="w-4 h-4" /> },
  };

  const config = priorityConfig[priority];

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <div className={`p-2 rounded-lg ${config.color}`}>
        {config.icon}
      </div>
    </div>
  );
}

interface QuickActionButtonProps {
  icon: React.ReactNode;
  text: string;
}

function QuickActionButton({ icon, text }: QuickActionButtonProps) {
  return (
    <button className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all hover:shadow-md">
      <div className="bg-blue-100 text-blue-600 p-3 rounded-lg mb-2">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-900 text-center">{text}</span>
    </button>
  );
}

interface ServiceProgressProps {
  service: string;
  status: string;
  color: 'green' | 'blue';
}

function ServiceProgress({ service, status, color }: ServiceProgressProps) {
  const colorClasses = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-gray-900 font-medium">{service}</span>
      <span className={`text-xs font-medium px-3 py-1 rounded-full ${colorClasses[color]}`}>
        {status}
      </span>
    </div>
  );
}
