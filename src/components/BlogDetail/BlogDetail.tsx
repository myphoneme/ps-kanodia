import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, User, Tag, Twitter, Linkedin, Link, ChevronUp
} from 'lucide-react';
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
  const [headings, setHeadings] = useState<{ text: string; id: string; level: number }[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        window.scrollTo(0, 0);

        const [postRes, allRes] = await Promise.all([
          fetch(`https://fastapi.phoneme.in/posts/${blogId}`),
          fetch('https://fastapi.phoneme.in/posts')
        ]);

        if (postRes.ok) {
          const data = await postRes.json();
          setPost(data);

          const parser = new DOMParser();
          const doc = parser.parseFromString(data.post, 'text/html');
          const hTags = doc.querySelectorAll('h2, h3');
          const extracted = Array.from(hTags).map((h) => {
            const id = h.textContent?.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '';
            h.id = id;
            return { text: h.textContent || '', id, level: h.tagName === 'H2' ? 2 : 3 };
          });
          setHeadings(extracted);
        }

        if (allRes.ok) {
          const all = await allRes.json();
          const filtered = all
            .filter((p: ApiBlogPost) => p.id !== Number(blogId))
            .sort((a: ApiBlogPost, b: ApiBlogPost) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
            .slice(0, 6);
          setRelatedPosts(filtered);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [blogId]);


  if (isLoading || !post) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner}></div>
        <p>Loading article...</p>
      </div>
    );
  }

  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
  const readingTime = Math.max(1, Math.ceil(post.post.split(/\s+/).length / 275));
  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(post.title);

  return (
    <>

      <div className={styles.blogDetail}>
        <div className={styles.container}>
          {/* Top Bar: Back + Category */}
          <div className={styles.topBar}>
            <button onClick={() => onNavigate('blog')} className={styles.backBtn}>
              <ArrowLeft size={18} /> All Articles
            </button>
            <div className={styles.categoryPill}>
              <Tag size={14} />
              {post.category.category_name}
            </div>
          </div>

          <div className={styles.layout}>
            <article className={styles.mainContent}>
              <h1 className={styles.title}>{post.title}</h1>

              <div className={styles.authorBar}>
                <div className={styles.author}>
                  <div className={styles.avatar}>
                    <User size={44} />
                  </div>
                  <div>
                    <p className={styles.authorName}>{post.created_user.name}</p>
                    <p className={styles.meta}>{date} · {readingTime} min read</p>
                  </div>
                </div>
              </div>

              <div className={styles.heroWrapper}>
                <img
                  src={`https://fastapi.phoneme.in/${post.image}`}
                  alt={post.title}
                  className={styles.hero}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&h=900&fit=crop';
                  }}
                />
              </div>

              {headings.length > 2 && (
                <div className={styles.tocDesktop}>
                  <p className={styles.tocTitle}>On this page</p>
                  {headings.map((h) => (
                    <a key={h.id} href={`#${h.id}`} className={`${styles.tocItem} ${h.level === 3 ? styles.tocSub : ''}`}>
                      {h.text}
                    </a>
                  ))}
                </div>
              )}

              <div ref={contentRef} className={styles.content} dangerouslySetInnerHTML={{ __html: post.post }} />
            </article>

            <aside className={styles.sidebar}>
              <div className={styles.sticky}>
                <div className={styles.shareBox}>
                  <p>Share this article</p>
                  <div className={styles.shareIcons}>
                    <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer">
                      <Twitter size={20} />
                    </a>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer">
                      <Linkedin size={20} />
                    </a>
                    <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Copied!'); }}>
                      <Link size={20} />
                    </button>
                  </div>
                </div>

                <div className={styles.recentBox}>
                  <p className={styles.recentTitle}>Recent Articles</p>
                  {relatedPosts.slice(0, 5).map((p) => (
                    <button key={p.id} onClick={() => onNavigate(`blogDetail:${p.id}`)} className={styles.recentItem}>
                      <img
                        src={`https://fastapi.phoneme.in/${p.image}`}
                        alt={p.title}
                        onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'}
                      />
                      <div>
                        <h4>{p.title}</h4>
                        <span>{new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={styles.backToTop}>
                  Back to top
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}