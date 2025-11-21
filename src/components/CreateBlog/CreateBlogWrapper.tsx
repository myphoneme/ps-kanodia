// src/components/CreateBlog/CreateBlogWrapper.tsx

import CreateBlog from './CreateBlog';

interface CreateBlogWrapperProps {
  blogId?: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function CreateBlogWrapper({ blogId, onBack, onSuccess }: CreateBlogWrapperProps) {
  return (
    <CreateBlog
      id={blogId}
      onBack={onBack}
      onSuccess={onSuccess}
    />
  );
}