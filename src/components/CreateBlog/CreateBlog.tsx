import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import styles from './CreateBlog.module.css';
import { globalContext } from '../Context';
import { FlashMessage } from '../../FlashMessage';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import { API_ENDPOINTS } from '../../utils/config';
import { AuthUser } from '../../utils/auth';

import { Eye, X, User, Clock, FileText } from 'lucide-react';

Quill.register('modules/imageResize', ImageResize);

interface CreateBlogProps {
  id?: string;
  onBack?: () => void;
  onSuccess?: () => void;
  authToken?: string | null;
  currentUser?: AuthUser | null;
}

interface BlogData {
  id: number;
  title: string;
  post: string;
  image: string;
  category: { id: number; category_name: string };
}

const CreateBlog: React.FC<CreateBlogProps> = ({ id: propId, onBack, onSuccess, authToken, currentUser }) => {
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

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
          const res = await fetch(API_ENDPOINTS.blogs.upload, {
            method: 'POST',
            body: uploadFormData,
            headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Upload failed');
          }
          const data = await res.json();

          const editor = quillRef.current?.getEditor();
          if (!editor) return;

          const range = editor.getSelection() || { index: 0 };
          // Prepend /backend/ to the returned relative path
          editor.insertEmbed(range.index, 'image', `/backend/${data.url}`);
          editor.setSelection(range.index + 1);
        } catch (err: any) {
          setFlash({ message: err.message || 'Failed to upload image to editor', type: 'error' });
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
  }, [authToken]);

  useEffect(() => {
    fetch(API_ENDPOINTS.categories.get)
      .then(res => res.json())
      .then(setCategories)
      .catch(() => setFlash({ message: "Failed to load categories", type: "error" }));

    if (blogId) {
      fetch(`${API_ENDPOINTS.blogs.get}?id=${blogId}`)
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
  data.append('created_by', currentUser?.id || '1');

  if (formData.image) {
    // New image selected
    data.append('image', formData.image);
  } else if (isEditMode && blogData?.image) {
    // Keep old image — correctly fetch with proper URL
    try {
      const imageUrl = new URL(blogData.image, window.location.origin + '/backend/').toString();
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
      ? API_ENDPOINTS.blogs.update
      : API_ENDPOINTS.blogs.insert;

    const response = await fetch(url, {
      method: 'POST', // PHP always uses POST for FormData with files
      body: data,
      headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Save failed');
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
                              href={`/backend/${blogData.image}`} 
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
            <button 
              type="button" 
              onClick={() => setIsPreviewOpen(true)}
              className="px-6 py-3 rounded-lg border-2 border-indigo-600 text-indigo-600 font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Preview Post
            </button>
            <button type="submit" className={styles.submitBtn}>
              {isEditMode ? 'Update Blog' : 'Publish Blog'}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Modal Overlay */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 md:p-8">
          <div className="bg-gray-50 w-full max-w-5xl rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 origin-top">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-[110] bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900">Live Preview</h3>
              </div>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Preview Content (Replicating ViewBlogSection style) */}
            <div className="p-4 md:p-10">
              <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                <article className="p-6 md:p-10">
                  <header className="mb-8 text-center">
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                        {categories.find(c => c.id.toString() === formData.category)?.category_name || 'Uncategorized'}
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
                      {formData.title || 'Your Blog Title Here'}
                    </h1>
                    
                    <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 border-y border-gray-100 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                          <User className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-gray-900">{currentUser?.name || 'Admin'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </header>

                  {/* Featured Image Preview */}
                  <div className="relative aspect-video mb-10 rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-200 bg-gray-100 flex items-center justify-center">
                    {formData.image ? (
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : isEditMode && blogData?.image ? (
                      <img
                        src={`/backend/${blogData.image}`}
                        alt="Existing"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center">
                        <FileText className="w-12 h-12 mb-2 opacity-20" />
                        <span>No featured image selected</span>
                      </div>
                    )}
                  </div>

                  <div className="rich-text-preview mx-auto max-w-none">
                    <style>{`
                      .rich-text-preview { color: #374151; line-height: 1.8; font-size: 1.125rem; }
                      .rich-text-preview h1 { font-size: 2.25rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; color: #111827; }
                      .rich-text-preview h2 { font-size: 1.875rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; color: #111827; }
                      .rich-text-preview h3 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #111827; }
                      .rich-text-preview p { margin-bottom: 1.25rem; }
                      .rich-text-preview img { border-radius: 1rem; margin: 2rem auto; max-width: 100%; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
                      .rich-text-preview ul, .rich-text-preview ol { margin-bottom: 1.25rem; padding-left: 1.5rem; }
                      .rich-text-preview ul { list-style-type: disc; }
                      .rich-text-preview ol { list-style-type: decimal; }
                      .rich-text-preview blockquote { border-left: 4px solid #3b82f6; padding: 1.5rem; font-style: italic; color: #4b5563; margin: 2rem 0; background: #f9fafb; border-radius: 0 1rem 1rem 0; }
                    `}</style>
                    <div dangerouslySetInnerHTML={{ __html: formData.body || '<p class="text-gray-400 italic">No content yet...</p>' }} />
                  </div>
                </article>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex justify-center">
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Back to Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBlog;