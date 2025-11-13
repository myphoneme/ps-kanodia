import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Plus, Edit2 } from 'lucide-react';
import styles from './AddCategory.module.css';

const AddCategory = ({ onSave, onClose, categoryToEdit }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [error, setError] = useState('');

  // Pre-fill form if editing
  useEffect(() => {
    if (categoryToEdit) {
      setCategoryName(categoryToEdit.name);
      setCategoryDescription(categoryToEdit.description);
      setCategoryImage(categoryToEdit.image || '');
    } else {
      resetForm();
    }
  }, [categoryToEdit]);

  const resetForm = () => {
    setCategoryName('');
    setCategoryDescription('');
    setCategoryImage('');
    setError('');
  };

  const handleSubmit = () => {
    if (!categoryName || !categoryDescription) {
      setError('All fields are required!');
      return;
    }

    const categoryData = {
      name: categoryName,
      description: categoryDescription,
      image: categoryImage || 'https://via.placeholder.com/300',
    };

    if (categoryToEdit) {
      // Update existing category
      onSave({ ...categoryToEdit, ...categoryData });
    } else {
      // Add new category
      onSave(categoryData);
    }

    resetForm();
    onClose(); // Close modal after submission
  };

  return (
    <div className={styles.formContainer}>
      {error && <p className="text-danger">{error}</p>}

      <Form>
        {/* Category Name */}
        <Form.Group className="mb-3">
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
          />
        </Form.Group>

        {/* Description */}
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            placeholder="Enter category description"
          />
        </Form.Group>

        {/* Image URL */}
        <Form.Group className="mb-3">
          <Form.Label>Image URL (optional)</Form.Label>
          <Form.Control
            type="text"
            value={categoryImage}
            onChange={(e) => setCategoryImage(e.target.value)}
            placeholder="Enter image URL"
          />
        </Form.Group>

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {categoryToEdit ? (
              <>
                <Edit2 size={16} className="me-2" />
                Update Category
              </>
            ) : (
              <>
                <Plus size={16} className="me-2" />
                Add Category
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddCategory;
