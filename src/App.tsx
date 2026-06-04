import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registration from './components/Registration';
import Products from './components/Products';
import AllProducts from './components/AllProducts';
import Categories from './components/Categories.tsx';
import Cart from './components/Cart';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/registration" element={<Registration />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:id" element={<Products />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;