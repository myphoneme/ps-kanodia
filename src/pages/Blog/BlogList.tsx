import { useState, useEffect } from 'react';
import { Clock, Tag, Lock } from 'lucide-react';
import styles from './Blog.module.css';
import { getBlogs } from '../../utils/storage';
import { BlogPost } from '../../types/blog';

interface BlogListProps {
  isPrivate?: boolean;
  isLoggedIn?: boolean;
}

export default function BlogList({ isPrivate = false, isLoggedIn = false }: BlogListProps) {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedBlogs = getBlogs(isLoggedIn);
    setBlogs(storedBlogs);
  }, [isLoggedIn]);

  const displayBlogs = blogs;

  const filteredBlogs = displayBlogs.filter(blog => {
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['all', 'taxation', 'audit', 'advisory', 'compliance'];

  return (
    <div className={styles.blogList}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            {isPrivate ? 'Private Blog Articles' : 'Blog'}
          </h1>
          <p className={styles.subtitle}>
            {isPrivate
              ? 'Exclusive content for team members'
              : 'Professional insights and updates on accounting, taxation, and finance'}
          </p>
        </div>
      </section>

      <section className={styles.blogSection}>
        <div className={styles.container}>
          <div className={styles.controls}>
            <div className={styles.search}>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.categories}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ''}`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {filteredBlogs.length > 0 ? (
            <div className={styles.blogsGrid}>
              {filteredBlogs.map(blog => (
                <article key={blog.id} className={styles.blogCard}>
                  <div className={styles.blogImage}>
                    <img src={blog.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=600&h=400&fit=crop'} alt={blog.title} />
                    {blog.is_private && (
                      <div className={styles.privateBadge}>
                        <Lock className={styles.lockIcon} />
                        Private
                      </div>
                    )}
                  </div>
                  <div className={styles.blogContent}>
                    <div className={styles.meta}>
                      <span className={styles.date}>
                        <Clock className={styles.metaIcon} />
                        {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                      {blog.category && (
                        <span className={styles.category}>
                          <Tag className={styles.metaIcon} />
                          {blog.category}
                        </span>
                      )}
                    </div>
                    <h2 className={styles.blogTitle}>{blog.title}</h2>
                    <p className={styles.blogExcerpt}>{blog.excerpt}</p>
                    <button className={styles.readMore}>Read More →</button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>No articles found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
