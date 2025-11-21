import { useState, useEffect } from 'react';
import { Calculator, LogOut, Mail, FileText, Users, LayoutGrid, Home, Plus, Trash2, Menu, X, Edit2 } from 'lucide-react';
import { getContacts, deleteContact, ContactRecord } from '../../utils/contactsApi';
import { getUsers, createUser, updateUser, deleteUser, UserRecord } from '../../utils/usersApi';
import { AuthUser } from '../../utils/auth';
import CategoriesList from '../CategoriesList/CategoriesList';
import CreateBlogWrapper from '../CreateBlog/CreateBlogWrapper'; // Your real editor
import { FlashMessage } from '../../FlashMessage';

interface AdminDashboardProps {
  onLogout: () => void;
  authToken?: string | null;
  currentUser?: AuthUser | null;
}

type SectionType = 'dashboard' | 'users' | 'blogs' | 'categories' | 'contacts' | 'createBlog' | 'editBlog' | 'viewBlog';

export default function AdminDashboard({ onLogout, authToken, currentUser }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<SectionType>('dashboard');
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ message: string; type: 'add' | 'update' | 'delete' | 'error' | 'info' | '' }>({ message: '', type: '' });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [authToken]);

  const loadData = async () => {
    // Contacts
    try {
      const remote = await getContacts(authToken);
      setContacts(remote);
    } catch (e) {
      console.error('Error loading contacts', e);
      setContacts([]);
    }

    // Users
    if (authToken) {
      setIsUsersLoading(true);
      try {
        const userList = await getUsers(authToken);
        setUsers(userList);
      } catch (error: any) {
        setUserError(error?.message || 'Failed to fetch users');
      } finally {
        setIsUsersLoading(false);
      }
    }

    // Blogs count
    try {
      const res = await fetch('https://fastapi.phoneme.in/posts');
      if (res.ok) {
        const data = await res.json();
        setTotalBlogs(data.length);
      }
    } catch (err) { console.error(err); }

    // Categories count
    try {
      const res = await fetch('https://fastapi.phoneme.in/categories');
      if (res.ok) {
        const data = await res.json();
        setTotalCategories(data.length);
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Delete this contact submission?')) return;
    try {
      await deleteContact(id, authToken);
      await loadData();
      setFlash({ message: 'Deleted successfully!', type: 'delete' });
    } catch (e: any) {
      setFlash({ message: e?.message || 'Delete failed', type: 'error' });
    }
  };

  const handleCreateUser = async (payload: { name: string; email: string; role: string; password: string }) => {
    if (!authToken) return;
    setIsUsersLoading(true);
    try {
      await createUser(payload, authToken);
      setFlash({ message: 'User created!', type: 'add' });
      await loadData();
    } catch (error: any) {
      setFlash({ message: error?.message || 'Failed to create user', type: 'error' });
    } finally {
      setIsUsersLoading(false);
    }
  };

  const handleUpdateUser = async (payload: { id: number; name: string; email: string; role: string; password?: string }) => {
    if (!authToken) return;
    setIsUsersLoading(true);
    try {
      await updateUser(payload, authToken);
      setFlash({ message: 'User updated!', type: 'update' });
      await loadData();
    } catch (error: any) {
      setFlash({ message: error?.message || 'Failed to update user', type: 'error' });
    } finally {
      setIsUsersLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!authToken || !confirm('Delete this user permanently?')) return;
    setIsUsersLoading(true);
    try {
      await deleteUser(id, authToken);
      setFlash({ message: 'User deleted!', type: 'delete' });
      await loadData();
    } catch (error: any) {
      setFlash({ message: error?.message || 'Failed to delete user', type: 'error' });
    } finally {
      setIsUsersLoading(false);
    }
  };

  const handleSidebarItemClick = (section: SectionType) => {
    setActiveSection(section);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FlashMessage message={flash.message} type={flash.type} onClose={() => setFlash({ message: '', type: '' })} />

      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 w-64 min-h-screen bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:transform-none ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6">
          <div className="flex items-center mb-8 space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">P.S Kanodia</h1>
              <p className="text-xs text-gray-600">Admin Portal</p>
            </div>
          </div>

          <nav className="space-y-1">
            <SidebarItem icon={<Home className="w-5 h-5" />} label="Dashboard" active={activeSection === 'dashboard'} onClick={() => handleSidebarItemClick('dashboard')} />
            <SidebarItem icon={<Users className="w-5 h-5" />} label="Users" count={users.length} active={activeSection === 'users'} onClick={() => handleSidebarItemClick('users')} />
            <SidebarItem icon={<FileText className="w-5 h-5" />} label="Blogs" count={totalBlogs} active={activeSection === 'blogs'} onClick={() => handleSidebarItemClick('blogs')} />
            <SidebarItem icon={<LayoutGrid className="w-5 h-5" />} label="Categories" active={activeSection === 'categories'} onClick={() => handleSidebarItemClick('categories')} />
            <SidebarItem icon={<Mail className="w-5 h-5" />} label="Contact Forms" count={contacts.length} active={activeSection === 'contacts'} onClick={() => handleSidebarItemClick('contacts')} />
          </nav>
        </div>

        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
          <div className="flex items-center mb-3 space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{currentUser?.name || 'Administrator'}</p>
              <p className="text-xs text-gray-600">{currentUser?.role || 'admin@pskanodia.com'}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <button className="p-2 lg:hidden" onClick={() => setIsMobileSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {activeSection === 'dashboard' && 'Dashboard Overview'}
                {activeSection === 'users' && 'User Management'}
                {activeSection === 'blogs' && 'Blog Management'}
                {activeSection === 'createBlog' && 'Create New Blog'}
                {activeSection === 'editBlog' && 'Edit Blog'}
                {activeSection === 'viewBlog' && 'View Blog'}
                {activeSection === 'categories' && 'Category Management'}
                {activeSection === 'contacts' && 'Contact Form Submissions'}
              </h2>
            </div>
            {activeSection === 'blogs' && (
              <button
                onClick={() => {
                  setSelectedBlogId(null);
                  setActiveSection('createBlog');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" /> Create New Blog
              </button>
            )}
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {activeSection === 'dashboard' && <DashboardSection totalBlogs={totalBlogs} totalCategories={totalCategories} contacts={contacts} totalUsers={users.length} />}
          {activeSection === 'users' && <UsersSection users={users} isLoading={isUsersLoading} error={userError} onCreate={handleCreateUser} onUpdate={handleUpdateUser} onDelete={handleDeleteUser} />}
          {activeSection === 'blogs' && <BlogsSection onEdit={(id) => { setSelectedBlogId(id); setActiveSection('editBlog'); }} onView={(id) => { setSelectedBlogId(id); setActiveSection('viewBlog'); }} onRefresh={loadData} onFlash={(msg, type) => setFlash({ message: msg, type })} />}
          
          {/* REAL CREATE / EDIT BLOG USING YOUR BEAUTIFUL COMPONENT */}
          {activeSection === 'createBlog' && (
            <CreateBlogWrapper
              onBack={() => setActiveSection('blogs')}
              onSuccess={() => {
                loadData();
                setActiveSection('blogs');
              }}
            />
          )}

          {activeSection === 'editBlog' && selectedBlogId && (
            <CreateBlogWrapper
              blogId={selectedBlogId}
              onBack={() => setActiveSection('blogs')}
              onSuccess={() => {
                loadData();
                setActiveSection('blogs');
              }}
            />
          )}

          {activeSection === 'viewBlog' && selectedBlogId && <ViewBlogSection blogId={selectedBlogId} onBack={() => setActiveSection('blogs')} />}
          {activeSection === 'categories' && <CategoriesList />}
          {activeSection === 'contacts' && <ContactsSection contacts={contacts} onDelete={handleDeleteContact} />}
        </main>
      </div>
    </div>
  );
}



interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  onClick: () => void;
}

function SidebarItem({ icon, label, count, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
        active
          ? 'bg-blue-50 text-blue-600 font-medium'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <span>{label}</span>
      </div>
      {count !== undefined && (
        <span className={`text-xs px-2 py-1 rounded-full ${
          active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function DashboardSection({
  totalBlogs,
  totalCategories,
  contacts,
  totalUsers,
}: {
  totalBlogs: number;
  totalCategories: number;
  contacts: ContactRecord[];
  totalUsers: number;
}) {
  const stats = [
    { label: 'Total Users', value: totalUsers.toString(), icon: <Users className="w-6 h-6" />, color: 'blue' },
    { label: 'Total Blogs', value: totalBlogs.toString(), icon: <FileText className="w-6 h-6" />, color: 'green' },
    { label: 'Categories', value: totalCategories.toString(), icon: <LayoutGrid className="w-6 h-6" />, color: 'purple' },
    { label: 'Contact Forms', value: contacts.length.toString(), icon: <Mail className="w-6 h-6" />, color: 'orange' },
  ];

  return (
    <div>
      {/* <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                stat.color === 'green' ? 'bg-green-100 text-green-600' :
                stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="mb-1 text-sm font-medium text-gray-600">{stat.label}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div> */}
      
      <div className="grid grid-cols-2 gap-4 mb-8 sm:gap-6 md:grid-cols-4">
  {stats.map((stat, index) => (
    <div
      key={index}
      className="flex flex-col justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow min-h-28 sm:min-h-32"
    >
      {/* Top: Icon + Number */}
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg ${
          stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
          stat.color === 'green' ? 'bg-green-100 text-green-600' :
          stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
          'bg-orange-100 text-orange-600'
        }`}>
          {stat.icon}
        </div>
        <span className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
          {stat.value}
        </span>
      </div>

      {/* Bottom: Label */}
      <p className="mt-3 text-xs font-medium text-gray-600 sm:text-sm line-clamp-2">
        {stat.label}
      </p>
    </div>
  ))}
</div>


      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Access your most used features</p>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 text-left transition-colors rounded-lg bg-blue-50 hover:bg-blue-100">
                <FileText className="w-6 h-6 mb-2 text-blue-600" />
                <p className="text-sm font-medium text-gray-900">Manage Blogs</p>
              </button>
              <button className="p-4 text-left transition-colors rounded-lg bg-green-50 hover:bg-green-100">
                <LayoutGrid className="w-6 h-6 mb-2 text-green-600" />
                <p className="text-sm font-medium text-gray-900">Categories</p>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Contact Forms</h3>
          {contacts.length === 0 ? (
            <p className="text-sm text-gray-500">No contact submissions yet</p>
          ) : (
            contacts.slice(0, 5).map((contact) => (
              <div key={contact.id} className="py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                  <p className="text-xs text-gray-500">{new Date(contact.created_at).toLocaleDateString()}</p>
                </div>
                <p className="text-xs text-gray-600">{contact.subject}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function UsersSection({
  users,
  isLoading,
  error,
  onCreate,
  onUpdate,
  onDelete,
}: {
  users: UserRecord[];
  isLoading: boolean;
  error: string | null;
  onCreate: (payload: { name: string; email: string; role: string; password: string }) => void;
  onUpdate: (payload: { id: number; name: string; email: string; role: string; password?: string }) => void;
  onDelete: (id: string) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', email: '', role: 'admin', password: '' });
  const [isEditing, setIsEditing] = useState(false);

  const openModal = (user?: UserRecord) => {
    if (user) {
      setFormData({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
      });
      setIsEditing(true);
    } else {
      setFormData({ id: '', name: '', email: '', role: 'admin', password: '' });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ id: '', name: '', email: '', role: 'admin', password: '' });
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name.trim() || !formData.email.trim()) return;
  if (!isEditing && !formData.password.trim()) return;

  try {
    // ❗Close modal immediately
    closeModal();

    if (isEditing) {
      const payload: any = {
        id: parseInt(formData.id, 10),
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
      };

      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      // run async in background
      onUpdate(payload);

    } else {
      // run async in background
      onCreate({
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        password: formData.password.trim(),
      });
    }

  } catch (error) {
    console.error("Failed to save user:", error);
  }
};


  return (
  
    <div className="space-y-6">
      {/* Main User List Card */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New User
          </button>
        </div>

        {error && (
          <div className="px-4 py-3 mb-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-gray-500 text-center py-8">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-12">No users found.<br />Click "Add New User" to get started.</p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 capitalize">
                    {user.role}
                  </span>
                </div>
                <div className="flex gap-2 mt-3 sm:mt-0">
                  <button
                    onClick={() => openModal(user)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(user.id.toString())}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal - Add/Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="user">User</option>
                </select>
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700">
                  Password {isEditing && <span className="text-gray-500 font-normal">(Leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!isEditing}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={isEditing ? '••••••••' : 'Enter strong password'}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {isLoading ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )};


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
 

function BlogsSection({
  onEdit,
  onView,
  onRefresh,
  onFlash
}: {
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onRefresh: () => void;
  onFlash: (message: string, type: 'add' | 'update' | 'delete' | 'error' | 'info') => void;
}) {
  const [blogs, setBlogs] = useState<ApiBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://fastapi.phoneme.in/posts');
      if (response.ok) {
        const data = await response.json();
        const sorted = data.sort((a: ApiBlogPost, b: ApiBlogPost) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setBlogs(sorted);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      onFlash('Failed to load blogs', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      const response = await fetch(`https://fastapi.phoneme.in/posts/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setBlogs(blogs.filter(blog => blog.id !== id));
        onRefresh();
        onFlash('Blog deleted successfully!', 'delete');
      } else {
        onFlash('Failed to delete blog', 'error');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      onFlash('An error occurred while deleting the blog', 'error');
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center">Loading blogs...</div>;
  }

  const indexOfLast = currentPage * blogsPerPage;
  const indexOfFirst = indexOfLast - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="space-y-4">
        {currentBlogs.map((blog) => {
          const excerpt = blog.post.replace(/<[^>]+>/g, '').slice(0, 150) + '...';
          return (
            <div key={blog.id} className="flex gap-4 p-4 transition-shadow border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md">
              <img
                src={`https://fastapi.phoneme.in/${blog.image}`}
                alt={blog.title}
                className="flex-shrink-0 object-cover w-32 h-32 rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=200&h=200&fit=crop';
                }}
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{blog.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
                        {blog.category.category_name}
                      </span>
                      <span>{blog.created_user.name}</span>
                      <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <p className="mb-3 text-sm text-gray-600">{excerpt}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onView(blog.id.toString())}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-sm font-medium transition-colors"
                  >
                    Read More
                  </button>
                  <button
                    onClick={() => onEdit(blog.id.toString())}
                    className="px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateBlogSection({ blogId, onBack, onSuccess }: { blogId?: string; onBack: () => void; onSuccess: () => void }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    body: '',
    image: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [flash, setFlash] = useState({ message: '', type: '' });

  useEffect(() => {
    fetch('https://fastapi.phoneme.in/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));

    if (blogId) {
      fetch(`https://fastapi.phoneme.in/posts/${blogId}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            category: data.category.id.toString(),
            title: data.title,
            body: data.post,
            image: null,
          });
        })
        .catch(error => console.error('Error fetching blog:', error));
    }
  }, [blogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.title || !formData.body) {
      setFlash({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }

    const data = new FormData();
    if (blogId) {
      data.append('id', parseInt(blogId, 10).toString());
    }
    data.append('category_id', parseInt(formData.category, 10).toString());
    data.append('title', formData.title);
    data.append('post', formData.body);
    data.append('created_by', '1');

    if (formData.image) {
      data.append('image', formData.image);
    } else if (!blogId) {
      setFlash({ message: 'Please upload an image', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const url = blogId ? `https://fastapi.phoneme.in/posts/${blogId}` : 'https://fastapi.phoneme.in/posts';
      const method = blogId ? 'PUT' : 'POST';
      const response = await fetch(url, { method, body: data });

      if (response.ok) {
        setFlash({ message: blogId ? 'Blog updated successfully!' : 'Blog created successfully!', type: 'success' });
        setTimeout(() => onSuccess(), 1500);
      } else {
        const errorData = await response.json();
        setFlash({ message: errorData.detail || 'Failed to save blog', type: 'error' });
      }
    } catch (error) {
      setFlash({ message: 'An error occurred', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <button onClick={onBack} className="mb-4 font-medium text-blue-600 hover:text-blue-700">
        ← Back to Blogs
      </button>
      {flash.message && (
        <div className={`mb-4 p-3 rounded ${flash.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {flash.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.category_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Content</label>
          <textarea
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={10}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Upload Image {blogId && '(optional)'}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : blogId ? 'Update Blog' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
}

function ViewBlogSection({ blogId, onBack }: { blogId: string; onBack: () => void }) {
  const [blog, setBlog] = useState<ApiBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`https://fastapi.phoneme.in/posts/${blogId}`)
      .then(res => res.json())
      .then(data => {
        setBlog(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching blog:', error);
        setIsLoading(false);
      });
  }, [blogId]);

  if (isLoading) {
    return <div className="py-12 text-center">Loading...</div>;
  }

  if (!blog) {
    return <div className="py-12 text-center">Blog not found</div>;
  }

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <button onClick={onBack} className="mb-4 font-medium text-blue-600 hover:text-blue-700">
        ← Back to Blogs
      </button>
      <article>
        <img
          src={`https://fastapi.phoneme.in/${blog.image}`}
          alt={blog.title}
          className="object-cover w-full mb-6 rounded-lg h-96"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=1200&h=600&fit=crop';
          }}
        />
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
          <span className="px-3 py-1 text-blue-700 bg-blue-100 rounded-full">
            {blog.category.category_name}
          </span>
          <span>{blog.created_user.name}</span>
          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
        </div>
        <h1 className="mb-6 text-3xl font-bold text-gray-900">{blog.title}</h1>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.post }}
        />
      </article>
    </div>
  );
}

function ContactsSection({ contacts, onDelete }: { contacts: ContactRecord[]; onDelete: (id: string) => void }) {
  if (contacts.length === 0) {
    return (
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="py-12 text-center">
          <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg text-gray-500">No contact submissions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="space-y-4">
        {contacts.map((contact, index) => {
          const contactId = contact.id || `contact-${index}`;
          const createdAt = contact.created_at ? new Date(contact.created_at) : null;

          return (
            <div
              key={contactId}
              className="p-6 transition-shadow border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3 space-x-4">
                    <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                    <span className="text-sm text-gray-500">
                      {createdAt
                        ? `${createdAt.toLocaleDateString()} at ${createdAt.toLocaleTimeString()}`
                        : 'N/A'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{contact.email}</p>
                    </div>
                   
                  </div>

                  <div className="mb-4">
                    <p className="mb-1 text-xs text-gray-500">Subject</p>
                    <p className="text-sm font-medium text-gray-900">{contact.subject}</p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs text-gray-500">Message</p>
                    <p className="text-sm leading-relaxed text-gray-700">{contact.message}</p>
                  </div>
                </div>

                {contact.id && (
                  <button
                    onClick={() => onDelete(contact.id as string)}
                    className="p-2 ml-4 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                    title="Delete submission"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}