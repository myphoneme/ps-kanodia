/*
  # Create Blog System Tables

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key) - Unique identifier for each blog post
      - `title` (text) - Blog post title
      - `content` (text) - Blog post content in markdown/rich format
      - `excerpt` (text) - Short preview of the blog post
      - `author_id` (uuid, foreign key) - Reference to auth.users for post author
      - `image_url` (text) - Featured image URL for the blog post
      - `category` (text) - Blog post category for organization
      - `is_private` (boolean) - Whether blog is visible only to logged-in employees
      - `created_at` (timestamp) - When the post was created
      - `updated_at` (timestamp) - When the post was last modified
      - `published_at` (timestamp) - When the post was published (null for drafts)

    - `blog_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Category name
      - `slug` (text, unique) - URL-friendly category identifier
      - `description` (text) - Category description

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policy for public users to read public blog posts
    - Add policy for authenticated users to read all blog posts (public + private)
    - Add policy for authenticated users to create blog posts
    - Add policy for users to update/delete only their own posts
    - Enable RLS on `blog_categories` table
    - Add policy for public read access to categories

  3. Important Notes
    - Private blogs (is_private=true) are only visible to authenticated users
    - Public blogs (is_private=false) are visible to all visitors
    - Employees can create, edit, and delete their own blog posts
    - Published_at field allows for draft management - null means draft
*/

CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url text,
  category text REFERENCES blog_categories(slug),
  is_private boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view public blog categories"
  ON blog_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read published public blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (is_private = false AND published_at IS NOT NULL);

CREATE POLICY "Authenticated users can read all published blog posts"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (published_at IS NOT NULL);

CREATE POLICY "Authenticated users can create blog posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own blog posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete their own blog posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_private ON blog_posts(is_private);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
