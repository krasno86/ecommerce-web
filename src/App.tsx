import { useEffect, useState } from 'react';
import api from './services/api';

interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');

        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (err: any) {
        setError('Не удалось загрузить товары. Проверь, запущен ли бэкенд!');
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  return (
      <div className="p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-h)]">Наш Магазин</h1>
          <p className="text-[var(--text)]">Тестовый запрос к бэкенду</p>
        </header>

        {error && <p className="text-red-500 mb-4 font-semibold">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {products.map((product) => (
              <div
                  key={product._id}
                  className="p-4 border border-[var(--border)] rounded-lg bg-[var(--bg)] shadow-sm"
              >
                <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
                <p className="text-sm mb-4 text-[var(--text)] line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                            <span className="font-mono font-bold text-lg text-[var(--accent)]">
                                {product.price} ₽
                            </span>
                  <button className="px-3 py-1 bg-[var(--accent)] text-white rounded hover:opacity-90 transition-opacity">
                    В корзину
                  </button>
                </div>
              </div>
          ))}
        </div>

        {products.length === 0 && !error && (
            <p className="text-[var(--text)]">Товаров пока нет или база данных пуста...</p>
        )}
      </div>
  );
}

export default App;