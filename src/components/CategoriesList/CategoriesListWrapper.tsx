import { BrowserRouter } from 'react-router-dom';
import CategoriesList from './CategoriesList';

export default function CategoriesListWrapper() {
  return (
    <BrowserRouter>
      <CategoriesList />
    </BrowserRouter>
  );
}
