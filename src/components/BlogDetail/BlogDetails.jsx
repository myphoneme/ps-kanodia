import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { Container, Row, Col } from 'react-bootstrap';
import { useUser } from "@clerk/clerk-react";
import { globalContext } from '../Context';

import {
  Calendar,
  Facebook,
  Twitter,
  Linkedin,
} from 'lucide-react';

import styles from './BlogDetail.module.css';
import Loading from '../Loading/Loading'; // ⭐️ Added loading component

function BlogDetails() {
  const { id } = useParams(); // Get the id from the URL
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // ⭐️ Added loading state

  const { user } = useUser();
  const { mode } = useContext(globalContext); // theme

  useEffect(() => {
    setIsLoading(true); // ⭐️ Start loading
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  
    // Fetch the full post using the id from the URL
    fetch(`https://fastapi.phoneme.in/posts/${id}`)
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.error('Error fetching post details:', error));

    fetch(`https://fastapi.phoneme.in/posts?limit=5`)
      .then((response) => response.json())
      .then((data) => {
        const sortedPosts = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRelatedPosts(sortedPosts.slice(0, 5));
      })
      .catch((error) => console.error('Error fetching related posts:', error))
      .finally(() => setIsLoading(false)); // ⭐️ Stop loading (semicolon added here)

  }, [id]);

  if (isLoading || !post) { // ⭐️ Show loader if loading or post not ready
    return <Loading />; // ⭐️ Using the loading component
  }

  return (
    <div className={`${styles.blogDetailsContainer} ${mode === 'light' ? 'bg-light text-dark' : 'text-light'}`}
        style={mode === 'dark' ? { backgroundColor: '#1a1a1a' } : {}}>
      <Container >
        <Row className={styles.mainContent}>
          <h5>{post.title}</h5>
          <Col lg={8} className='mt-4'>
            <div className={`${styles.contentWrapper} ${mode === 'light' ? "bg-light text-dark" : "bg-dark text-light"}`}>
              <div className={styles.featuredImage}>
                <img
                  src={`https://fastapi.phoneme.in/${post.image}`} 
                  alt="Featured"
                />
              </div>
              <div className={styles.articleContent}>
                <p className={styles.lead}>
                  {post.post ? (
                    <span dangerouslySetInnerHTML={{ __html: post.post }} />
                  ) : (
                    "Content not available"
                  )}
                </p>
              </div>

              <div className={styles.socialShareBottom}>
                <p>Share this article:</p>
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

              <div className={`${styles.authorBox} ${mode === 'light' ? "bg-light text-dark" : "bg-dark text-light"}`}>
                <img
                  src={user?.imageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60"}
                  alt="Author"
                />
                <div className={styles.authorInfo}>
                  <h3>{post.created_user.name}</h3>
                  <p>Senior Tech Writer & Developer Advocate</p>
                  <p>
                    John is a seasoned developer and tech enthusiast with over 10 years
                    of experience in web development. He writes about emerging technologies
                    and their impact on the future of software development.
                  </p>
                </div>
              </div>

              <h5>Comments</h5>
              <div className={styles.mainpost}>
                <div> <img src="https://up.yimg.com/ib/th?id=OIP.Kk4i-k-7bOfsgPv0SJtj5AHaHa&pid=Api&rs=1&c=1&qlt=95&w=119&h=119" alt="Study Spot" /></div>
                <div className="card-content">
                  <div className={styles.comm}>@hello</div>
                </div>
              </div>
              <div className={styles.mainpost}>
                <div> <img src="https://wallpaperaccess.com/full/4322061.jpg" alt="Study Spot" /></div>
                <div className="card-content">
                  <div className={styles.comm}>Best Study Spots on Campus</div>
                </div>
              </div>
              <div className={styles.mainpost}>
                <div> <img src="https://up.yimg.com/ib/th?id=OIP.lguyAqtw00Ia5vuLUEEr9QHaFj&pid=Api&rs=1&c=1&qlt=95&w=165&h=123" alt="Study Spot" /></div>
                <div className="card-content">
                  <div className={styles.comm}>Best topic</div>
                </div>
              </div>

              <div className={styles.commentSection}>
                <div className={styles.commentForm}>
                  <textarea
                    placeholder="Write a comment..."
                  />                 
                </div>
                <button className={styles.postbtn}>Comment</button>
              </div>
            </div>
          </Col>

          <Col lg={4} className='mt-4'>
            <div className={styles.sidebar}>
              <div className={`${styles.sidebarSection} ${mode === 'light' ? "bg-light text-dark" : "bg-dark text-light"}`}>
                <h3>Related Articles</h3>
                {relatedPosts.map((blog, index) => (
                  <Link to={`/details/${blog.id}`} key={blog.id} className={styles.relatedPostLink}>
                    <div key={index} className={styles.relatedPost}>
                      <img src={`https://fastapi.phoneme.in/${blog.image}`} alt={blog.title} />
                      <div>
                        <h4>{blog.title}</h4>
                        <span><Calendar size={14} />  {new Date(blog.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BlogDetails;
