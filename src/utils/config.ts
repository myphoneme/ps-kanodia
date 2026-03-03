/**
 * Centralized API configuration.
 * Change this value to switch between local development and production.
 * 
 * For local development, if your PHP is running on the same port: '/backend/api'
 * If your PHP is on a different port (e.g. XAMPP): 'http://localhost/ps-kanodia/backend/api'
 */
export const API_BASE_URL = '/backend/api';

export const API_ENDPOINTS = {
  // Auth
  login: `${API_BASE_URL}/login.php`,

  // Blogs (New PHP APIs)
  blogs: {
    get: `${API_BASE_URL}/posts/get.php`,
    getByCategory: `${API_BASE_URL}/posts/get_by_category.php`,
    insert: `${API_BASE_URL}/posts/insert.php`,
    update: `${API_BASE_URL}/posts/update.php`,
    delete: `${API_BASE_URL}/posts/delete.php`,
    upload: `${API_BASE_URL}/upload.php`,
  },

  // Categories
  categories: {
    get: `${API_BASE_URL}/categories/get.php`,
    insert: `${API_BASE_URL}/categories/insert.php`,
    update: `${API_BASE_URL}/categories/update.php`,
    delete: `${API_BASE_URL}/categories/delete.php`,
  },

  // Contacts
  contacts: {
    base: `${API_BASE_URL}/contacts`,
    get: `${API_BASE_URL}/contacts/get.php`,
    insert: `${API_BASE_URL}/contacts/insert.php`,
    delete: `${API_BASE_URL}/contacts/delete.php`,
  },

  // Users
  users: {
    base: `${API_BASE_URL}/users`,
    read: `${API_BASE_URL}/users/read.php`,
    create: `${API_BASE_URL}/users/create.php`,
    update: `${API_BASE_URL}/users/update.php`,
    delete: `${API_BASE_URL}/users/delete.php`,
  }
};
