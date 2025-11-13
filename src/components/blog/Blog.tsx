import { Clock, Tag, User } from 'lucide-react';
import styles from './Blog.module.css';
import { useState, useEffect } from 'react';

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

interface Category {
  id: number;
  category_name: string;
}

interface BlogProps {
  isPrivate?: boolean;
  isLoggedIn?: boolean;
  onNavigate?: (page: string) => void;
}

export default function Blog({ isPrivate = false, isLoggedIn = false, onNavigate }: BlogProps) {
  const [blogs, setBlogs] = useState<ApiBlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [blogsResponse, categoriesResponse] = await Promise.all([
          fetch('https://fastapi.phoneme.in/posts'),
          fetch('https://fastapi.phoneme.in/categories')
        ]);

        if (blogsResponse.ok) {
          const blogsData = await blogsResponse.json();
          const sortedBlogs = blogsData.sort((a: ApiBlogPost, b: ApiBlogPost) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setBlogs(sortedBlogs);
        }

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'all' || blog.category.id === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.post.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.blog}>
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
              <button
                onClick={() => setSelectedCategory('all')}
                className={`${styles.categoryBtn} ${selectedCategory === 'all' ? styles.active : ''}`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`${styles.categoryBtn} ${selectedCategory === cat.id ? styles.active : ''}`}
                >
                  {cat.category_name}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className={styles.empty}>
              <p>Loading articles...</p>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className={styles.blogsGrid}>
              {filteredBlogs.map(blog => {
                const excerpt = blog.post.replace(/<[^>]+>/g, '').slice(0, 200) + '...';
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
                        onClick={() => onNavigate && onNavigate(`blogDetail:${blog.id}`)}
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
            <div className={styles.empty}>
              <p>No articles found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
