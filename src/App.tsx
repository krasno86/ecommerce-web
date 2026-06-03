import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registration from './components/Registration';
import Products from './components/Products';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/registration" element={<Registration />} />
          {/*<Route path="/categories" element={<Categories />} />*/}
          <Route path="/products" element={<Products />} />

        </Routes>
      </BrowserRouter>
  );
}

export default App;