import { BrowserRouter } from 'react-router-dom';
import BlogList from './BlogList';

export default function BlogListWrapper() {
  return (
    <BrowserRouter>
      <BlogList />
    </BrowserRouter>
  );
}
