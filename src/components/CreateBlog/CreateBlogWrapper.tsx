// src/components/CreateBlog/CreateBlogWrapper.tsx

import CreateBlog from './CreateBlog';
import { AuthUser } from '../../utils/auth';

interface CreateBlogWrapperProps {
  blogId?: string;
  onBack: () => void;
  onSuccess: () => void;
  authToken?: string | null;
  currentUser?: AuthUser | null;
}

export default function CreateBlogWrapper({ 
  blogId, 
  onBack, 
  onSuccess,
  authToken,
  currentUser 
}: CreateBlogWrapperProps) {
  return (
    <CreateBlog
      id={blogId}
      onBack={onBack}
      onSuccess={onSuccess}
      authToken={authToken}
      currentUser={currentUser}
    />
  );
}