# Quick Start Guide

## Project Overview
A professional Chartered Accountants website with component-based architecture, modular CSS, and a public/private blog system.

## What's Included

### 📱 Pages
- **Landing Page** - Hero section with services, about, blog preview, contact
- **About Page** - Company story, team profiles, achievements, certifications
- **Services Page** - Detailed service cards with features and benefits
- **Contact Page** - Contact form, business info, hours
- **Blog** - Public blog for all visitors, private blogs for employees

### 🎨 Components
- **Header** - Responsive navigation (shared across all pages)
- **Footer** - Company info, links, hours (shared across all pages)
- **ServiceCard** - Reusable service display component
- **BlogCard** - Professional blog post preview cards

### 🗄️ Database
- **Supabase** - Already configured with blog tables
- **RLS Policies** - Secure public/private blog access
- **Dummy Data** - 6 sample blog posts ready to use

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Then open `http://localhost:5173` in your browser.

### 3. Build for Production
```bash
npm run build
```

## File Structure

```
src/
├── components/
│   ├── shared/           # Reusable components
│   │   ├── Header.tsx
│   │   ├── Header.module.css
│   │   ├── Footer.tsx
│   │   └── Footer.module.css
│   ├── LandingPage.tsx   # Home page with all sections
│   ├── Dashboard.tsx     # Employee dashboard
│   └── LandingPage.module.css
├── pages/               # Page components with routing
│   ├── About/
│   ├── Services/
│   ├── Contact/
│   └── Blog/
├── types/               # TypeScript interfaces
│   └── blog.ts
├── utils/               # Helper functions
│   └── supabase.ts
└── App.tsx             # Main app with routing logic
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on localhost:5173 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |
| `npm run typecheck` | Check TypeScript types |

## Navigation

### Landing Page Sections
- Click on navigation links to scroll to sections
- Use "Get Started" button for login
- "Contact Us" button scrolls to contact form

### Page Navigation (After Login)
After logging in, you can navigate between:
- Dashboard (Employee portal)
- About page
- Services page
- Contact page
- Blog (with private articles visible)

## Blog Features

### Public Blog (Visible to Everyone)
- Browse articles by category
- Search for articles
- View article metadata (date, category)

### Private Blog (Employees Only)
- Private badge indicator
- Accessible only after login
- Same filtering and search as public blogs

### Categories
- Taxation
- Audit
- Advisory
- Compliance

## Dummy Blog Data

6 sample blogs are included:
1. **Understanding GST Compliance in 2025** (Public)
2. **Income Tax Planning Strategies** (Public)
3. **Audit Red Flags** (Public)
4. **Employee Benefits Guide** (Private)
5. **Financial Statement Analysis** (Public)
6. **Internal Audit Best Practices** (Private)

## Styling

### CSS Approach
- **Module CSS** - Scoped styles per component (`.module.css`)
- **Tailwind CSS** - Utility classes available
- **Responsive** - Mobile-first design

### Colors
- Primary: Blue (#2563eb)
- Secondary: Dark Blue (#1e40af)
- Background: Light Gray (#f9fafb)
- Text: Dark Gray (#111827)

## Authentication

Currently using simple state management. To connect with Supabase Auth:

```typescript
// In App.tsx
const handleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: userEmail,
    password: userPassword,
  });

  if (!error) {
    setIsLoggedIn(true);
  }
};
```

## Backend Integration

See `BACKEND_INTEGRATION_GUIDE.md` for detailed instructions on connecting with FastAPI:
- Blog CRUD operations
- Contact form submission
- Authentication flows
- API error handling

## Images

All images use Unsplash CDN URLs (free to use):
- Professional team photos
- Business and finance imagery
- Service-related pictures

## Customization

### Change Company Name
Search for "P.S Kanodia & Co." and replace with your company name

### Update Contact Info
Edit `src/pages/Contact/Contact.tsx` and `src/components/LandingPage.tsx`

### Add More Blog Posts
Edit `src/pages/Blog/BlogList.tsx` - modify the `DUMMY_BLOGS` array

### Update Services
Edit `src/pages/Services/Services.tsx` or `src/components/LandingPage.tsx`

### Change Colors
Update color values in `.module.css` files (all use hex format)

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

Current build size:
- **HTML**: 0.48 kB
- **CSS**: 33.25 kB (gzipped: 6.74 kB)
- **JS**: 323.16 kB (gzipped: 93.87 kB)

## TypeScript

All components are fully typed with TypeScript. No `any` types used.

Key interfaces in `src/types/blog.ts`:
- `BlogPost` - Complete blog post data
- `BlogCategory` - Blog category data
- `CreateBlogPostInput` - For new blog creation

## Database Connection

Supabase is pre-configured. Check `.env` for credentials:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Anonymous key for client-side access

## Next Steps

1. **Connect Backend**: Follow `BACKEND_INTEGRATION_GUIDE.md`
2. **Add Authentication**: Implement Supabase Auth
3. **Enable Blog Creation**: Build blog management UI
4. **Process Contact Form**: Connect to backend email service
5. **Add Analytics**: Track user behavior
6. **Deploy**: Push to production

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### Module Not Found Error
```bash
npm install
```

### CSS Not Applying
Make sure you're using `.module.css` files and importing them correctly

### Build Errors
```bash
npm run typecheck  # Check TypeScript errors
npm run lint       # Check linting issues
```

## Support Files

- `IMPLEMENTATION_SUMMARY.md` - Complete feature list
- `BACKEND_INTEGRATION_GUIDE.md` - API integration instructions
- `FILE_STRUCTURE.txt` - Full file tree
- `QUICK_START.md` - This file

## Production Checklist

- [ ] Update company information
- [ ] Add real team photos
- [ ] Set up contact form backend
- [ ] Configure Supabase authentication
- [ ] Add blog management interface
- [ ] Set up SSL certificate
- [ ] Configure analytics
- [ ] Test on mobile devices
- [ ] Update SEO meta tags
- [ ] Deploy to production

## Questions?

Refer to the supporting documentation:
1. `IMPLEMENTATION_SUMMARY.md` - Architecture overview
2. `BACKEND_INTEGRATION_GUIDE.md` - FastAPI integration
3. Code comments in component files
4. TypeScript types for data structure reference
