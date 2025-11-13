import { BrowserRouter } from 'react-router-dom';
import CreateBlog from './CreateBlog';

export default function CreateBlogWrapper() {
  return (
    <BrowserRouter>
      <CreateBlog />
    </BrowserRouter>
  );
}
