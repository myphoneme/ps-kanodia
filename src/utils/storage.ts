import { BlogPost } from '../types/blog';

const BLOGS_KEY = 'ca_website_blogs';
const CONTACTS_KEY = 'ca_website_contacts';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

const INITIAL_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding GST Compliance in 2025',
    excerpt: 'A comprehensive guide to GST compliance requirements and best practices for businesses.',
    content: 'Full content here...',
    author_id: 'author1',
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    category: 'taxation',
    is_private: false,
    created_at: new Date('2025-01-15').toISOString(),
    updated_at: new Date('2025-01-15').toISOString(),
    published_at: new Date('2025-01-15').toISOString(),
  },
  {
    id: '2',
    title: 'Income Tax Planning Strategies for Salaried Professionals',
    excerpt: 'Effective strategies to minimize tax liability for salaried employees.',
    content: 'Full content here...',
    author_id: 'author1',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=600&h=400&fit=crop',
    category: 'taxation',
    is_private: false,
    created_at: new Date('2025-01-10').toISOString(),
    updated_at: new Date('2025-01-10').toISOString(),
    published_at: new Date('2025-01-10').toISOString(),
  },
  {
    id: '3',
    title: 'Audit Red Flags: What Assessors Look For',
    excerpt: 'Understanding common audit triggers and how to prepare for tax assessments.',
    content: 'Full content here...',
    author_id: 'author1',
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    category: 'audit',
    is_private: false,
    created_at: new Date('2025-01-08').toISOString(),
    updated_at: new Date('2025-01-08').toISOString(),
    published_at: new Date('2025-01-08').toISOString(),
  },
  {
    id: '4',
    title: 'Employee Benefits and Compliance Guide',
    excerpt: 'Complete guide to employee benefits, taxation, and compliance requirements.',
    content: 'Full content here...',
    author_id: 'author1',
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    category: 'compliance',
    is_private: true,
    created_at: new Date('2025-01-05').toISOString(),
    updated_at: new Date('2025-01-05').toISOString(),
    published_at: new Date('2025-01-05').toISOString(),
  },
  {
    id: '5',
    title: 'Financial Statement Analysis Basics',
    excerpt: 'Learn how to analyze financial statements and identify key financial metrics.',
    content: 'Full content here...',
    author_id: 'author1',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=600&h=400&fit=crop',
    category: 'advisory',
    is_private: false,
    created_at: new Date('2025-01-01').toISOString(),
    updated_at: new Date('2025-01-01').toISOString(),
    published_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: '6',
    title: 'Internal Audit Process Best Practices',
    excerpt: 'Implementing effective internal audit procedures in your organization.',
    content: 'Full content here...',
    author_id: 'author1',
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    category: 'audit',
    is_private: true,
    created_at: new Date('2024-12-28').toISOString(),
    updated_at: new Date('2024-12-28').toISOString(),
    published_at: new Date('2024-12-28').toISOString(),
  },
];

function initializeBlogs(): void {
  const stored = localStorage.getItem(BLOGS_KEY);
  if (!stored) {
    localStorage.setItem(BLOGS_KEY, JSON.stringify(INITIAL_BLOGS));
  }
}

export function getBlogs(isLoggedIn: boolean = false): BlogPost[] {
  initializeBlogs();
  const stored = localStorage.getItem(BLOGS_KEY);
  const blogs: BlogPost[] = stored ? JSON.parse(stored) : INITIAL_BLOGS;

  if (isLoggedIn) {
    return blogs;
  }

  return blogs.filter(blog => !blog.is_private);
}

export function getBlogById(id: string): BlogPost | null {
  const blogs = getBlogs(true);
  return blogs.find(blog => blog.id === id) || null;
}

export function createBlog(blog: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): BlogPost {
  const blogs = getBlogs(true);
  const newBlog: BlogPost = {
    ...blog,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  blogs.push(newBlog);
  localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
  return newBlog;
}

export function updateBlog(id: string, updates: Partial<BlogPost>): BlogPost | null {
  const blogs = getBlogs(true);
  const index = blogs.findIndex(blog => blog.id === id);

  if (index === -1) return null;

  blogs[index] = {
    ...blogs[index],
    ...updates,
    id: blogs[index].id,
    created_at: blogs[index].created_at,
    updated_at: new Date().toISOString(),
  };

  localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
  return blogs[index];
}

export function deleteBlog(id: string): boolean {
  const blogs = getBlogs(true);
  const filtered = blogs.filter(blog => blog.id !== id);

  if (filtered.length === blogs.length) return false;

  localStorage.setItem(BLOGS_KEY, JSON.stringify(filtered));
  return true;
}

export function getContactSubmissions(): ContactSubmission[] {
  const stored = localStorage.getItem(CONTACTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveContactSubmission(contact: Omit<ContactSubmission, 'id' | 'created_at'>): ContactSubmission {
  const contacts = getContactSubmissions();
  const newContact: ContactSubmission = {
    ...contact,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  };

  contacts.unshift(newContact);
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  return newContact;
}

export function deleteContactSubmission(id: string): boolean {
  const contacts = getContactSubmissions();
  const filtered = contacts.filter(c => c.id !== id);

  if (filtered.length === contacts.length) return false;

  localStorage.setItem(CONTACTS_KEY, JSON.stringify(filtered));
  return true;
}
