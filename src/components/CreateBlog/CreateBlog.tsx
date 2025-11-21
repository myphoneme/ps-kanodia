import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import styles from './CreateBlog.module.css';
import { globalContext } from '../Context';
import { FlashMessage } from '../../FlashMessage';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

interface CreateBlogProps {
  id?: string;
  onBack?: () => void;
  onSuccess?: () => void;
}

interface BlogData {
  id: number;
  title: string;
  post: string;
  image: string;
  category: { id: number; category_name: string };
}

const CreateBlog: React.FC<CreateBlogProps> = ({ id: propId, onBack, onSuccess }) => {
  const { mode } = useContext(globalContext);
  const quillRef = useRef<any>(null);

  const blogId = propId;
  const isEditMode = !!blogId;

  const [categories, setCategories] = useState<any[]>([]);
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [flash, setFlash] = useState({ message: "", type: "" });

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    body: '',
    image: null as File | null,
  });

  const modules = useMemo(() => {
    const imageHandler = () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        try {
          const res = await fetch('https://fastapi.phoneme.in/upload', {
            method: 'POST',
            body: uploadFormData,
          });

          if (!res.ok) throw new Error('Upload failed');
          const data = await res.json();

          const editor = quillRef.current?.getEditor();
          if (!editor) return;

          const range = editor.getSelection() || { index: 0 };
          editor.insertEmbed(range.index, 'image', data.url);
          editor.setSelection(range.index + 1);
        } catch (err) {
          setFlash({ message: 'Failed to upload image to editor', type: 'error' });
        }
      };
    };

    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: { image: imageHandler },
      },
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
      },
    };
  }, []);

  useEffect(() => {
    fetch('https://fastapi.phoneme.in/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(() => setFlash({ message: "Failed to load categories", type: "error" }));

    if (blogId) {
      fetch(`https://fastapi.phoneme.in/posts/${blogId}`)
        .then(res => res.json())
        .then(data => {
          setBlogData(data);
          setFormData({
            category: data.category.id.toString(),
            title: data.title,
            body: data.post,
            image: null,
          });
        })
        .catch(() => setFlash({ message: "Failed to load blog post", type: "error" }));
    }
  }, [blogId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData(prev => ({ ...prev, image: file }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.title.trim() || !formData.category || !formData.body.trim()) {
    setFlash({ message: "Please fill all required fields", type: "error" });
    return;
  }

  if (!formData.image && !isEditMode) {
    setFlash({ message: "Please upload a featured image", type: "error" });
    return;
  }

  const data = new FormData();
  if (blogId) data.append('id', blogId);
  data.append('category_id', formData.category);
  data.append('title', formData.title.trim());
  data.append('post', formData.body);
  data.append('created_by', '1');

  if (formData.image) {
    // New image selected
    data.append('image', formData.image);
  } else if (isEditMode && blogData?.image) {
    // Keep old image — correctly fetch with proper URL
    try {
      const imageUrl = new URL(blogData.image, 'https://fastapi.phoneme.in').toString();
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to fetch image');

      const blob = await response.blob();
      const filename = blogData.image.split('/').pop() || 'image.jpg';
      const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });

      data.append('image', file);
    } catch (err) {
      console.warn('Could not re-fetch old image:', err);
      // Fallback: send dummy (rare case)
      const dummy = new File([''], 'keep.jpg', { type: 'image/jpeg' });
      data.append('image', dummy);
    }
  }

  try {
    const url = isEditMode
      ? `https://fastapi.phoneme.in/posts/${blogId}`
      : 'https://fastapi.phoneme.in/posts';

    const response = await fetch(url, {
      method: isEditMode ? 'PUT' : 'POST',
      body: data,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail?.[0]?.msg || 'Save failed');
    }

    setFlash({
      message: isEditMode ? "Blog updated successfully!" : "Blog created successfully!",
      type: "success",
    });

    setTimeout(() => onSuccess?.(), 1500);
  } catch (error: any) {
    setFlash({ message: error.message || "An error occurred", type: "error" });
  }
};

  return (
    <div className={`${styles.wrapper} ${mode === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          {onBack && (
            <button onClick={onBack} className="mb-4 text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2">
              ← Back to Blogs
            </button>
          )}

          <h1 className={styles.title}>
            {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          <p className={styles.subtitle}>
            {isEditMode ? 'Update your article' : 'Share your insights with the world'}
          </p>
        </div>

        <FlashMessage message={flash.message} type={flash.type} onClose={() => setFlash({ message: "", type: "" })} />

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Title <span className={styles.required}>*</span></label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter a compelling blog title"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Category <span className={styles.required}>*</span></label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className={styles.select}
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Content <span className={styles.required}>*</span></label>
            <div className={styles.editorContainer}>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={formData.body}
                onChange={(value) => setFormData(prev => ({ ...prev, body: value }))}
                modules={modules}
                placeholder="Start writing..."
                className={styles.quill}
              />
            </div>
          </div>

          {/* Featured Image - Clean & Reliable Version */}
          <div className={styles.field}>
            <label className={styles.label}>
              Featured Image {!isEditMode && <span className={styles.required}>*</span>}
            </label>

            {/* Show current image as clickable filename */}
            {isEditMode && blogData?.image && !formData.image && (
              <div className={styles.currentImageInfo}>
                <span className={styles.currentLabel}>Current Image:</span>{' '}
                <a
                  href={`https://fastapi.phoneme.in${blogData.image}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.imageLink}
                >
                  {blogData.image.split('/').pop()}
                </a>
                <span className={styles.changeHint}> → Upload new to replace</span>
              </div>
            )}

            {/* Show new selected image */}
            {formData.image && (
              <div className={styles.newImageInfo}>
                <span className={styles.newLabel}>New Image:</span>{' '}
                <strong>{formData.image.name}</strong>
              </div>
            )}

            <div className={styles.uploadBox}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="featured-image"
                className={styles.fileInput}
              />
              <label htmlFor="featured-image" className={styles.uploadLabel}>
                <span className={styles.uploadText}>
                  {formData.image ? 'Change image' : 'Choose image'}
                </span>
              </label>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn}>
              {isEditMode ? 'Update Blog' : 'Publish Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;