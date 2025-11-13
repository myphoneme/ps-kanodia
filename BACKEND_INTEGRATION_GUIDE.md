# Backend Integration Guide - FastAPI

This guide explains how to connect your FastAPI backend with the React frontend for blog management, contact forms, and authentication.

## 1. Blog CRUD Operations

### 1.1 Get All Blogs

**Frontend**: `src/pages/Blog/BlogList.tsx`

```typescript
// Replace the dummy data fetch with:
const fetchBlogs = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/blogs', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setBlogs(data);
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }
};
```

**FastAPI Endpoint**:
```python
@app.get("/api/blogs")
async def get_blogs(skip: int = 0, limit: int = 10):
    # Return public blogs OR all blogs if authenticated
    return blogs
```

### 1.2 Create Blog

```typescript
const createBlog = async (blogData: CreateBlogPostInput) => {
  const response = await fetch('http://localhost:8000/api/blogs', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blogData),
  });
  return response.json();
};
```

**FastAPI Endpoint**:
```python
@app.post("/api/blogs")
async def create_blog(blog: CreateBlogPostInput, current_user: User = Depends(get_current_user)):
    # Save to database
    return new_blog
```

### 1.3 Update Blog

```typescript
const updateBlog = async (id: string, blogData: Partial<BlogPost>) => {
  const response = await fetch(`http://localhost:8000/api/blogs/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blogData),
  });
  return response.json();
};
```

### 1.4 Delete Blog

```typescript
const deleteBlog = async (id: string) => {
  const response = await fetch(`http://localhost:8000/api/blogs/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
  return response.json();
};
```

## 2. Contact Form Submission

**Frontend**: `src/pages/Contact/Contact.tsx`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:8000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
```

**FastAPI Endpoint**:
```python
from pydantic import BaseModel, EmailStr

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str]
    subject: str
    message: str

@app.post("/api/contact")
async def submit_contact(form: ContactForm):
    # Save to database or send email
    return {"message": "Thank you for your inquiry"}
```

## 3. Authentication

### 3.1 Login

```typescript
const handleLogin = async (email: string, password: string) => {
  const response = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  localStorage.setItem('authToken', data.access_token);
  setIsLoggedIn(true);
};
```

**FastAPI Endpoint**:
```python
from fastapi.security import OAuth2PasswordBearer
from fastapi_jwt_extended import create_access_token

@app.post("/api/auth/login")
async def login(email: str, password: str):
    user = authenticate_user(email, password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.id})
    return {"access_token": access_token}
```

### 3.2 Logout

```typescript
const handleLogout = () => {
  localStorage.removeItem('authToken');
  setIsLoggedIn(false);
};
```

## 4. Environment Variables

Add these to your `.env` file:

```
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Use in your code:
```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

## 5. API Service Layer

Create `src/services/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiService = {
  async getBlog(id: string) {
    const res = await fetch(`${API_URL}/api/blogs/${id}`);
    return res.json();
  },

  async createBlog(data: CreateBlogPostInput) {
    const res = await fetch(`${API_URL}/api/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateBlog(id: string, data: Partial<BlogPost>) {
    const res = await fetch(`${API_URL}/api/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteBlog(id: string) {
    const res = await fetch(`${API_URL}/api/blogs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return res.json();
  },

  async submitContact(data: ContactForm) {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
```

## 6. Error Handling

Add try-catch blocks with user-friendly error messages:

```typescript
try {
  const result = await apiService.createBlog(formData);
  if (result.error) {
    setError(result.error);
  } else {
    setSuccess('Blog created successfully!');
  }
} catch (error) {
  setError('An error occurred. Please try again.');
}
```

## 7. Loading States

```typescript
const [loading, setLoading] = useState(false);

const fetchBlogs = async () => {
  setLoading(true);
  try {
    const blogs = await apiService.getBlogs();
    setBlogs(blogs);
  } finally {
    setLoading(false);
  }
};
```

## 8. CORS Configuration (FastAPI)

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 9. TypeScript Interfaces to Update

Make sure your FastAPI models match these:

```typescript
// From src/types/blog.ts

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author_id: string;
  image_url: string | null;
  category: string | null;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface CreateBlogPostInput {
  title: string;
  content: string;
  excerpt: string;
  image_url?: string;
  category?: string;
  is_private: boolean;
  published_at?: string | null;
}
```

## 10. Testing the API Integration

1. Start your FastAPI server: `uvicorn main:app --reload`
2. Start your React app: `npm run dev`
3. Check browser console for any CORS or fetch errors
4. Use browser DevTools Network tab to inspect API calls

## 11. Next Steps

1. Implement authentication with JWT tokens
2. Add form validation on both frontend and backend
3. Implement image upload for blog featured images
4. Add pagination for blog listing
5. Create admin dashboard for blog management
6. Add email notifications for contact form submissions
7. Implement caching strategy for blog posts

## 12. Security Considerations

- Validate all inputs on both frontend and backend
- Use HTTPS in production
- Implement rate limiting on API endpoints
- Use secure headers (CORS, CSP, etc.)
- Never expose secrets in frontend code
- Verify user authentication before allowing modifications
- Sanitize user input to prevent XSS attacks

## Quick Reference

| Operation | Frontend File | Endpoint | Method |
|-----------|--------------|----------|--------|
| Get Blogs | BlogList.tsx | `/api/blogs` | GET |
| Create Blog | BlogManagement.tsx | `/api/blogs` | POST |
| Update Blog | BlogManagement.tsx | `/api/blogs/{id}` | PUT |
| Delete Blog | BlogManagement.tsx | `/api/blogs/{id}` | DELETE |
| Submit Contact | Contact.tsx | `/api/contact` | POST |
| Login | App.tsx | `/api/auth/login` | POST |
| Logout | App.tsx | `/api/auth/logout` | POST |
