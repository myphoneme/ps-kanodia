import React, { useContext,useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Edit2, Trash2, BookOpen, Calendar, User } from 'lucide-react';
import styles from './BlogList.module.css';
import { Link , useNavigate } from 'react-router-dom';
import { globalContext } from '../Context';
import { FlashMessage } from '../../FlashMessage';
import Loading from '../Loading/Loading';
import { useLocation } from 'react-router-dom'; // for the post count click

const BlogList = () => {

  const [flash, setFlash] = useState({ message: "", type: "" });
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get('category_id');

  const navigate = useNavigate();
    // useEffect(() => {
    //   const fetchBlogs = async () => {
    //     setIsLoading(true);
    //     try {
    //       const response = await fetch('https://fastapi.phoneme.in/posts');
    //       if (!response.ok) {
    //         throw new Error('Failed to fetch blogs');
    //       }
    //       const data = await response.json();
    //       setBlogs(data); 
      
    //     } catch (error) {
    //       setError(error.message);
        
    //     }
    //     finally {
    //       setIsLoading(false); // 🔄 stop spinner
    //     }
    //   };
    //   fetchBlogs();
    // }, []);

    useEffect(() => {
      const fetchBlogs = async () => {
        setIsLoading(true);
        try {
          let url = 'https://fastapi.phoneme.in/posts'; // Default URL to fetch all posts
          if (categoryId) {
            // If categoryId exists, use the specific endpoint to filter by category
            url = `https://fastapi.phoneme.in/get_posts_by_category_id/${categoryId}`;
          }
  
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Failed to fetch blogs');
          }
          const data = await response.json();
          setBlogs(data); // Set fetched blogs
        } catch (error) {
          setError(error.message); // Handle errors
        } finally {
          setIsLoading(false); // Stop loading indicator
        }
      };
  
      fetchBlogs();
    }, [categoryId]);

  const handleEdit = (id) => {
    navigate(`/createBlog/${id}`);
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      const response = await fetch(`https://fastapi.phoneme.in/posts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete blog');
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
      // alert('Blog deleted  111 successfully');
      setFlash({ message: "Blog deleted successfully", type: "delete" });
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  const handleReadMore = (id) => {
    navigate(`/details/${id}`);  // Redirect to the details page for the clicked blog
  };
  
  
  if (isLoading) return <Loading />; // 👈 render spinner
  if (error) return <div>Error: {error}</div>;
  const sortedBlogs = [...blogs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const { mode } = useContext(globalContext);//theme

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = sortedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  return (
    // <div className={`${styles.mainContainer} ${mode === 'light' ? "bg-light text-dark" : "bg-dark text-light"} `}  style={mode === 'dark' ? { backgroundColor: '#1a1a1a' } : {}}>
    <div
    className={`${styles.mainContainer} ${mode === 'light' ? 'bg-light text-dark' : 'text-light'}`}
    style={mode === 'dark' ? { backgroundColor: '#1a1a1a' } : {}}
  >
  
   <Container>
   <FlashMessage
        message={flash.message}
        type={flash.type}
        onClose={() => setFlash({ message: "", type: "" })}
      />
        <Row>
          {/* Users blog */}
          <Col lg={8}>
          <h3>Users Blog</h3>
            {/* {blogs.map((blog) => ( */} 
            {currentBlogs.map((blog) => (

              <div key={blog.id} className={`${styles.blogCard} ${mode === 'light' ? "bg-white text-dark" : "bg-dark text-light"}`}>
                <Row >
                  <Col md={4}>
                  <div className={styles.imageContainer}>
                    <img
                      src={`https://fastapi.phoneme.in/${blog.image}`}
                      alt={blog.title}
                      className={styles.blogImage}
                    />
                  </div>
                  </Col>
                  <Col md={8}>
                  <div className={styles.contentContainer}>
                    <span className={styles.category}>{blog.category.category_name}</span>
                    <h2 className={styles.blogTitle}>{blog.title}</h2>
                    {/* <p className={styles.blogContent} >{blog.post}</p> */}
                    {/* <div className={styles.blogContent} dangerouslySetInnerHTML={{ __html: blog.post }} /> */}
                    <p className={styles.blogContent}>
                      {blog.post.replace(/<[^>]+>/g, '').slice(0, 200)}...
                    </p>
                    <div className={styles.metadata}>
                      <span className="d-flex align-items-center gap-2">
                        <User size={14} />
                        {blog.created_user.name}
                      </span>
        
                      <span className="d-flex align-items-center gap-2">
                        <Calendar size={14} />
                        {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.buttonContainer}>
                      <Button variant="primary" className={`${styles.button} ${styles.readMoreBtn}`}onClick={() => handleReadMore(blog.id)} > <BookOpen size={14} /> Read More </Button>
                      <Button variant="warning" className={`${styles.button} ${styles.editBtn}`} onClick={() => handleEdit(blog.id)} ><Edit2 size={14} />  Edit </Button>
                      <Button variant="danger" className={`${styles.button} ${styles.deleteBtn}`}onClick={() => handleDelete(blog.id)}><Trash2 size={14} /> Delete</Button>
                    </div>
                  </div>
                  </Col>
                </Row>
              </div>
            ))}

            {/* 👇 Pagination buttons */}
{sortedBlogs.length > blogsPerPage && (
  <div className={styles.pagination}>
    {[...Array(Math.ceil(sortedBlogs.length / blogsPerPage))].map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentPage(index + 1)}
        className={`${styles.paginationButton} ${currentPage === index + 1 ? styles.activePage : ''}`}
      >
        {index + 1}
      </button>
    ))}
  </div>
)}

          </Col>

          {/* recent posts */}
          <Col lg={4} >
          <div className={`${styles.recentPost} ${mode === 'light' ? "bg-white text-dark" : "bg-dark text-light"}`}> 
            <div className="sticky-top" style={{ top: '2rem' }}>
              <h3 className={styles.sidebarTitle}>Recent Posts</h3>
              {sortedBlogs.slice(0, 5).map((blog) => (
                <div key={blog.id} className={`${styles.recentPost} ${mode === 'light' ? "bg-light text-dark" : "bg-dark text-light"}`} onClick={() => handleReadMore(blog.id)}>
                  <img
                    src={`https://fastapi.phoneme.in/${blog.image}`}
                    alt={blog.title}
                    className={styles.recentPostImage}
                  />
                  <div className={styles.recentPostContent}>
                    <h4 className={styles.recentPostTitle}>{blog.title}</h4>
                    <div className={styles.recentPostDate}>
                    {new Date(blog.created_at).toLocaleDateString()}
                    </div>
                    <div className={styles.recentPostDate}>
                    {blog.created_user.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BlogList;
