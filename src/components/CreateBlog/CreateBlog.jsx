import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CreateBlog.module.css';
import { globalContext } from '../Context';
import { FlashMessage } from '../../FlashMessage';
import ReactQuill , {Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
Quill.register('modules/imageResize', ImageResize); // ✅ Register here

const CreateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mode } = useContext(globalContext);
  const quillRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [flash, setFlash] = useState({ message: "", type: "" });
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    body: '',
    image: null,
  });

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: () => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();
  
          input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append('file', file);
  
            try {
              const res = await fetch('https://fastapi.phoneme.in/upload', {
                method: 'POST',
                body: formData
              });
  
              const data = await res.json();
              const editor = quillRef.current.getEditor();
              const range = editor.getSelection(true);
              editor.insertEmbed(range.index, 'image', data.url);
            } catch (err) {
              console.error('Image upload failed:', err);
            }
          };
        }
      }
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize'],
    }
  
  }), []);

  useEffect(() => {
    fetch('https://fastapi.phoneme.in/categories')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setFlash({ message: "Failed to load categories", type: "error" });
      });

    if (id) {
      fetch(`https://fastapi.phoneme.in/posts/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            category: data.category.id.toString(),
            title: data.title,
            body: data.post,
            image: null,
          });
        })
        .catch((error) => {
          console.error('Error fetching blog data:', error);
          setFlash({ message: "Failed to load blog data", type: "error" });
        });
    }
  }, [id]);

  const handleChange = (e) => {
    if (typeof e === 'string') {
      setFormData((prev) => ({ ...prev, body: e }));
    } else {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.title || !formData.body) {
      setFlash({ message: "Please fill in all required fields", type: "error" });
      return;
    }

    const data = new FormData();
    if (id) {
      data.append('id', parseInt(id, 10));
    }
    data.append('category_id', parseInt(formData.category, 10));
    data.append('title', formData.title);
    data.append('post', formData.body);
    data.append('created_by', 1); // You might want to change this dynamically

    if (formData.image) {
      data.append('image', formData.image);
    } else if (!id) {
      setFlash({ message: "Please upload an image", type: "error" });
      return;
    }

    try {
      const url = id ? `https://fastapi.phoneme.in/posts/${id}` : 'https://fastapi.phoneme.in/posts';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, { method, body: data });

      if (!response.ok) {
        const errorData = await response.json();
        setFlash({ message: errorData.detail || "Failed to create/update blog", type: "error" });
      } else {
        setFlash({ message: id ? "Blog updated successfully!" : "Blog created successfully!", type: id ? "update" : "add" });
        setTimeout(() => navigate('/list', { replace: true }), 3000);
      }
    } catch (error) {
      setFlash({ message: "An error occurred. Please try again", type: "error" });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      const response = await fetch(`https://fastapi.phoneme.in/posts/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        setFlash({ message: errorData.detail || "Failed to delete blog", type: "error" });
      } else {
        setFlash({ message: "Blog deleted successfully!", type: "delete" });
        setTimeout(() => navigate('/list'), 3000);
      }
    } catch (error) {
      setFlash({ message: "An error occurred while deleting", type: "error" });
    }
  };

  return (
    <div className={mode === 'light' ? "bg-light text-dark" : "bg-dark text-light"}>
      <div className={styles.container}>
        <FlashMessage message={flash.message} type={flash.type} onClose={() => setFlash({ message: "", type: "" })} />
        <h1 className={styles.heading}>{id ? 'Edit Blog' : 'Create a New Blog'}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className={`${styles.input} ${mode === 'light' ? "bg-light text-dark" : "bg-dark text-light"}`} placeholder="Enter Blog Title" required />

          <label className={styles.label}>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} className={`${styles.select} ${mode === 'light' ? "bg-light text-dark" : "bg-dark text-light"}`} required>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.category_name}</option>
            ))}
          </select>


          <label className={styles.label}>Content:</label>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={formData.body}
            onChange={(value) => setFormData((prev) => ({ ...prev, body: value }))}
            modules={modules}
            placeholder="Write your blog content here..."
            className={`${styles.quillEditor} ${mode === 'light' ? "bg-light text-dark" : "bg-dark text-light"}`}
          />
          
          <label className={styles.label}>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className={styles.fileInput} />

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>{id ? 'Update Blog' : 'Create Blog'}</button>
            {id && <button type="button" onClick={handleDelete} className={styles.deleteButton}>Delete Blog</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
