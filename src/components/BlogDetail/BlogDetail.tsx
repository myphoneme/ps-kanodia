import { useState, useEffect } from 'react';
import { Calendar, User, Clock, Tag, Facebook, Twitter, Linkedin, ArrowLeft } from 'lucide-react';
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

  return (
    <div className={styles.blogDetail}>
      <div className={styles.container}>
        <button onClick={() => onNavigate('blog')} className={styles.backButton}>
          <ArrowLeft className={styles.backIcon} />
          Back to All Articles
        </button>

        <div className={styles.content}>
          <div className={styles.mainColumn}>
            <article className={styles.article}>
              <div className={styles.meta}>
                <span className={styles.category}>
                  <Tag className={styles.metaIcon} />
                  {post.category.category_name}
                </span>
                <span className={styles.date}>
                  <Clock className={styles.metaIcon} />
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className={styles.author}>
                  <User className={styles.metaIcon} />
                  {post.created_user.name}
                </span>
              </div>

              <h1 className={styles.title}>{post.title}</h1>

              <div className={styles.featuredImage}>
                <img
                  src={`https://fastapi.phoneme.in/${post.image}`}
                  alt={post.title}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=1200&h=600&fit=crop';
                  }}
                />
              </div>

              <div
                className={styles.articleContent}
                dangerouslySetInnerHTML={{ __html: post.post }}
              />

              <div className={styles.shareSection}>
                <p className={styles.shareTitle}>Share this article:</p>
                <div className={styles.socialButtons}>
                  <button className={`${styles.socialButton} ${styles.facebook}`}>
                    <Facebook size={20} />
                  </button>
                  <button className={`${styles.socialButton} ${styles.twitter}`}>
                    <Twitter size={20} />
                  </button>
                  <button className={`${styles.socialButton} ${styles.linkedin}`}>
                    <Linkedin size={20} />
                  </button>
                </div>
              </div>

              <div className={styles.authorBox}>
                <div className={styles.authorAvatar}>
                  <User size={40} />
                </div>
                <div className={styles.authorInfo}>
                  <h3 className={styles.authorName}>{post.created_user.name}</h3>
                  <p className={styles.authorBio}>
                    Professional content writer with expertise in finance and accounting topics.
                  </p>
                </div>
              </div>
            </article>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Related Articles</h3>
              {relatedPosts.length > 0 ? (
                <div className={styles.relatedPosts}>
                  {relatedPosts.map((relatedPost) => (
                    <button
                      key={relatedPost.id}
                      onClick={() => onNavigate(`blogDetail:${relatedPost.id}`)}
                      className={styles.relatedPost}
                    >
                      <img
                        src={`https://fastapi.phoneme.in/${relatedPost.image}`}
                        alt={relatedPost.title}
                        className={styles.relatedImage}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=200&h=200&fit=crop';
                        }}
                      />
                      <div className={styles.relatedContent}>
                        <h4 className={styles.relatedTitle}>{relatedPost.title}</h4>
                        <span className={styles.relatedDate}>
                          <Calendar size={14} />
                          {new Date(relatedPost.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className={styles.noRelated}>No related articles found.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
