import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

interface Product {
    _id: string;
    title: string;
    price: number;
    description: string;
    images: string[];
}

interface Category {
    name: string;
}

function App() {
    const { id } = useParams<{ id: string }>();
    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get(`/categories/${id}`);

                if (response.data.success) {
                    setCategory(response.data.data.category);
                    setProducts(response.data.data.products);
                }
            } catch (err: any) {
                setError('Failed to load products. Please check if the backend server is running.');
                console.error(err);
            }
        };

        if (id) fetchProducts();
    }, [id]);

    return (
        <div className="max-w-6xl mx-auto p-6 text-left">
            <div className="mb-6">
                <Link to="/categories" className="text-sm font-medium text-[var(--accent)] hover:underline">
                    ← Back to categories
                </Link>
            </div>

            <header className="mb-10">
                <h1 className="text-3xl font-black tracking-tight text-[var(--text-h)] md:text-4xl uppercase">
                    {category?.name || 'Loading Category...'}
                </h1>
                <p className="mt-1 text-sm text-[var(--text)]/60">
                    Showing {products.length} products
                </p>
            </header>

            {error && (
                <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative border-b border-[var(--border)]/50">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={`http://localhost:3000${product.images[0]}`}
                                    alt={product.title}
                                    className="h-full w-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                                    onError={(e) => {
                                        // Заглушка, если картинка на бэке удалена или повреждена
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x450?text=No+Product+Image';
                                    }}
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-zinc-400 text-sm">
                                    No image available
                                </div>
                            )}
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                            <h2 className="text-xl font-bold text-[var(--text-h)] mb-1 group-hover:text-[var(--accent)] transition-colors duration-300">
                                {product.title}
                            </h2>

                            <p className="text-sm text-[var(--text)]/70 line-clamp-2 flex-1 mb-4">
                                {product.description}
                            </p>

                            <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]/30">
                                <span className="font-mono font-black text-xl text-[var(--text-h)]">
                                    ${product.price}
                                </span>
                                <button className="px-4 py-2 bg-[var(--accent)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity shadow-sm">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && !error && (
                <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-2xl">
                    <p className="text-[var(--text)]">No products found in this category...</p>
                </div>
            )}
        </div>
    );
}

export default App;