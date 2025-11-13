import React, {  useContext,useState, useEffect } from 'react';
import {
  BookOpen,
  Code,
  Camera,
  Music,
  Palette,
  Utensils,
  Plus,
  LayoutGrid,
  List,
  Edit,
  Trash2,
} from 'lucide-react';
import { Modal, Button } from 'react-bootstrap';
import { FlashMessage } from '../../FlashMessage';
import AddCategory from './AddCategory';
import styles from './Categories.module.css';
import { globalContext } from '../Context';
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading'; // ★ Added Loading component import


const iconMapping = {
  technology: Code,
  literature: BookOpen,
  photography: Camera,
  music: Music,
  art: Palette,
  food: Utensils,
  fashion: Palette,
  default: BookOpen,
};

const fetchImageForCategory = async (categoryName) => {
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${categoryName}&per_page=1`, {
      headers: { Authorization: "mDQv97YgInpiiB7lDK2rdkwvusNMjNA2aalf8TI57b99Rg5xle9oPBy5" },
    });
    const data = await response.json();
    return data.photos.length > 0 ? data.photos[0].src.medium : "https://www.jaggaer.com/wp-content/uploads/2024/06/Category-intelligence-product.jpg";
  } catch (error) {
    console.error("Error fetching image for category:", error);
    return "https://www.jaggaer.com/wp-content/uploads/2024/06/Category-intelligence-product.jpg";
  }
};

function CategoriesList() {
  const { mode } = useContext(globalContext);//theme
  const [categories, setCategories] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [flash, setFlash] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false); // ★ Added isLoading state


  const fetchPostCount = async (categoryId) => {
    try {
      const response = await fetch(`https://fastapi.phoneme.in/get_posts_by_category_id/${categoryId}`, {
        method: 'GET',  // Using GET method as per your endpoint
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch posts for category ID: ${categoryId}`);
      }
  
      const data = await response.json();
      return Array.isArray(data) ? data.length : 0;  // Return the count of posts
    } catch (error) {
      console.error(`Error fetching post count for category ${categoryId}:`, error);
      return 0;
    }
  };


  const fetchCategories = async () => {
    setIsLoading(true); // ★ Set loading state to true before fetching
    try {
      const response = await fetch('https://fastapi.phoneme.in/categories');
      if (!response.ok) {
        throw new Error('Error fetching categories');
      }
  
      const data = await response.json();
  
      const formattedData = await Promise.all(data.map(async (cat) => {
        // Fetch the post count for the current category
        const postCount = await fetchPostCount(cat.id);
        return {
          id: cat.id,
          name: cat.category_name,
          description: `Explore posts related to ${cat.category_name}`,
          count: postCount,  // Use postCount here
          icon: iconMapping[cat.category_name.toLowerCase()] || iconMapping.default,
          image: await fetchImageForCategory(cat.category_name),
        };
      }));
  
      setCategories(formattedData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setFlash({
        message: "Failed to fetch categories. Please try again.",
        type: "error"
      });
    } finally {
      setIsLoading(false); // ★ Set loading state to false after fetching
    }
  };
  

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveCategory = async (category) => {
    const url = category.id
      ? `https://fastapi.phoneme.in/categories/${category.id}`
      : 'https://fastapi.phoneme.in/categories';

    const method = category.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_name: category.name,
        }),
      });

      if (response.ok) {
        setFlash({
          message: `Category "${category.name}" ${category.id ? 'updated' : 'added'} successfully!`,
          type: category.id ? 'update' : 'add'
        });
        fetchCategories();
      } else {
        const errorData = await response.json();
        setFlash({
          message: errorData.detail || `Failed to ${category.id ? 'update' : 'add'} category`,
          type: "error"
        });
      }
    } catch (error) {
      console.error(`Error ${category.id ? 'updating' : 'adding'} category:`, error);
      setFlash({
        message: `An error occurred while ${category.id ? 'updating' : 'adding'} the category`,
        type: "error"
      });
    }

    setShowModal(false);
    setCategoryToEdit(null);
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://fastapi.phoneme.in/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFlash({
          message: "Category deleted successfully!",
          type: "delete"
        });
        fetchCategories();
      } else {
        const errorData = await response.json();
        setFlash({
          message: errorData.detail || "Failed to delete category",
          type: "error"
        });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setFlash({
        message: "An error occurred while deleting the category",
        type: "error"
      });
    }
  };
  if (isLoading) return <Loading />; // ★ Render Loading component if isLoading is true


  return (
    <div className={`${styles.container} ${mode === 'light' ? "bg-light text-dark" : "bg-dark text-light"}`}>
      <FlashMessage
        message={flash.message}
        type={flash.type}
        onClose={() => setFlash({ message: "", type: "" })}
      />

      <header className={`${styles.header} ${mode === 'light' ? "bg-light text-dark" : "bg-dark text-light"}`}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>Blog Categories</h1>
          <div className={styles.headerActions}>
            <button className={styles.addButton} onClick={() => { setCategoryToEdit(null); setShowModal(true); }}>
              <Plus className={styles.buttonIcon} />
              Add Category
            </button>
            <button className={styles.viewToggle} onClick={() => setIsGridView(!isGridView)}>
              {isGridView ? <List className={styles.buttonIcon} /> : <LayoutGrid className={styles.buttonIcon} />}
            </button>
          </div>
        </div>
      </header>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{categoryToEdit ? 'Edit Category' : 'Add Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddCategory onSave={handleSaveCategory} onClose={() => setShowModal(false)} categoryToEdit={categoryToEdit} />
        </Modal.Body>
      </Modal>

      <div className={styles.main}>
        <div className={isGridView ? styles.grid : styles.list}>
          {categories.map((category) => {
            const Icon = category.icon || BookOpen;
            return (
              <div key={category.id} className={styles.card}>
                <div className={styles.imageContainer}>
                  <img src={category.image} alt={category.name} className={styles.image} />
                  <div className={styles.gradient} />
                </div>
                <div className={styles.iconContainer}><Icon className={styles.icon} /></div>
                <div className={styles.content}>
                  <div className={styles.titleRow}>
                    <h2 className={styles.title}>{category.name}</h2>
                    {/* <span className={styles.count}>{category.count} posts</span> */}
                    <Link to={`/list?category_id=${category.id}`} className={styles.count}>
                    {category.count} posts
                    </Link>
                  </div>
                  <p className={styles.description}>{category.description}</p>
                  <div className={styles.actions}>
                    <button
                      className={`${styles.actionButton} ${styles.editButton}`}
                      onClick={() => {
                        setCategoryToEdit(category);
                        setShowModal(true);
                      }}
                    >
                      <Edit className={styles.actionIcon} />
                      Edit
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className={styles.actionIcon} />
                      Delete
                    </button>
                  </div>
                </div>
                {/* <a
                  href={`/category/${category.id}`}
                  className={styles.link}
                  aria-label={`View ${category.name} category`}
                /> */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CategoriesList;


