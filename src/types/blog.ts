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

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
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
