import { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import styles from './Blog.module.css';
import { getBlogs, deleteBlog as removeStorageBlog, updateBlog as updateStorageBlog, createBlog } from '../../utils/storage';
import { BlogPost } from '../../types/blog';

interface BlogManagementProps {
  isLoggedIn?: boolean;
}

export default function BlogManagement({ isLoggedIn = false }: BlogManagementProps) {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      const storedBlogs = getBlogs(true);
      setBlogs(storedBlogs);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <div>Please login to manage blogs</div>;
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      removeStorageBlog(id);
      setBlogs(blogs.filter(b => b.id !== id));
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleSave = async (formData: any) => {
    if (editingId) {
      const updated = updateStorageBlog(editingId, formData);
      if (updated) {
        setBlogs(blogs.map(b => b.id === editingId ? updated : b));
      }
    } else {
      const newBlog = createBlog({
        ...formData,
        author_id: 'current_user',
        published_at: new Date().toISOString(),
      });
      setBlogs([...blogs, newBlog]);
    }
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className={styles.management}>
      <div className={styles.container}>
        <h2>Blog Management</h2>
        <button onClick={handleAdd} className={styles.addBtn}>
          <Plus className={styles.icon} />
          Add New Blog
        </button>

        {showForm && (
          <BlogForm
            blog={editingId ? blogs.find(b => b.id === editingId) : null}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        )}

        <div className={styles.blogsList}>
          {blogs.map(blog => (
            <div key={blog.id} className={styles.blogItem}>
              <div>
                <h3>{blog.title}</h3>
                <p>{blog.category} • {blog.published_at}</p>
              </div>
              <div className={styles.actions}>
                <button onClick={() => handleEdit(blog.id)} className={styles.editBtn}>
                  <Edit2 className={styles.icon} />
                </button>
                <button onClick={() => handleDelete(blog.id)} className={styles.deleteBtn}>
                  <Trash2 className={styles.icon} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BlogForm({ blog, onSave, onCancel }: any) {
  const [formData, setFormData] = useState(blog || {
    title: '',
    content: '',
    excerpt: '',
    category: 'taxation',
    is_private: false,
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSave(formData);
    }} className={styles.form}>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Excerpt"
        value={formData.excerpt}
        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
        rows={2}
      />
      <textarea
        placeholder="Content"
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        rows={6}
        required
      />
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      >
        <option value="taxation">Taxation</option>
        <option value="audit">Audit</option>
        <option value="advisory">Advisory</option>
        <option value="compliance">Compliance</option>
      </select>
      <label>
        <input
          type="checkbox"
          checked={formData.is_private}
          onChange={(e) => setFormData({ ...formData, is_private: e.target.checked })}
        />
        Private (Only for logged-in employees)
      </label>
      <button type="submit">Save Blog</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}
