import { useState, useEffect } from 'react';
import { Calendar, User, Clock, Tag, ArrowLeft } from 'lucide-react';
import styles from './BlogDetail.module.css';

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

interface BlogDetailProps {
  blogId: string;
  onNavigate: (page: string) => void;
}

export default function BlogDetail({ blogId, onNavigate }: BlogDetailProps) {
  const [post, setPost] = useState<ApiBlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<ApiBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const [postResponse, allPostsResponse] = await Promise.all([
          fetch(`https://fastapi.phoneme.in/posts/${blogId}`),
          fetch('https://fastapi.phoneme.in/posts')
        ]);

        if (postResponse.ok) {
          const postData = await postResponse.json();
          setPost(postData);
        }

        if (allPostsResponse.ok) {
          const allPosts = await allPostsResponse.json();
          const sortedPosts = allPosts
            .filter((p: ApiBlogPost) => p.id.toString() !== blogId)
            .sort((a: ApiBlogPost, b: ApiBlogPost) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
            .slice(0, 5);
          setRelatedPosts(sortedPosts);
        }
      } catch (error) {
        console.error('Error fetching blog details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [blogId]);

  if (isLoading || !post) {
    return (
      <div className={styles.loading}>
        <p>Loading article...</p>
      </div>
    );
  }

  const publishedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={styles.blogDetail}>
      <div className={styles.container}>
        <button onClick={() => onNavigate('blog')} className={styles.backButton}>
          <ArrowLeft size={18} />
          Back to Blogs
        </button>

        <article className={styles.articleCard}>
          <img
            src={`https://fastapi.phoneme.in/${post.image}`}
            alt={post.title}
            className={styles.articleImage}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=1200&h=600&fit=crop';
            }}
          />

          <div className={styles.metaRow}>
            <span className={styles.category}>
              <Tag size={16} />
              {post.category.category_name}
            </span>
            <span className={styles.metaItem}>
              <User size={16} />
              {post.created_user.name}
            </span>
            <span className={styles.metaItem}>
              <Clock size={16} />
              {publishedDate}
            </span>
          </div>

          <h1 className={styles.title}>{post.title}</h1>

          <div
            className={styles.articleContent}
            dangerouslySetInnerHTML={{ __html: post.post }}
          />
        </article>

        <section className={styles.relatedSection}>
          <h3>Related Articles</h3>
          {relatedPosts.length > 0 ? (
            <div className={styles.relatedList}>
              {relatedPosts.map((relatedPost) => (
                <button
                  key={relatedPost.id}
                  onClick={() => onNavigate(`blogDetail:${relatedPost.id}`)}
                  className={styles.relatedCard}
                >
                  <img
                    src={`https://fastapi.phoneme.in/${relatedPost.image}`}
                    alt={relatedPost.title}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=200&h=200&fit=crop';
                    }}
                  />
                  <div>
                    <p>{relatedPost.title}</p>
                    <span>{new Date(relatedPost.created_at).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className={styles.noRelated}>No related articles found.</p>
          )}
        </section>
      </div>
    </div>
  );
}
