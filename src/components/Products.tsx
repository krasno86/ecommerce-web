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
    const [cartQuantity, setQuantity] = useState<number>(0);
    const { id } = useParams<{ id: string }>();
    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleClick = async (productId: string) => {
        try {
            setError('');
            const response = await api.post('/cart', { productId });
            if (response.data && response.data.success) {
                setQuantity(response.data.data.totalQuantity || response.data.totalQuantity);
            }
        } catch (err: any) {
            if (err.response && err.response.status === 401) {
                setError('Please log in or register to add items to your cart.');
            } else {
                setError('Failed to add product. Please check your connection.');
            }
            console.error(err);
        }
    };

    const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const params: any = {};
            if (id) params.category = id;
            if (searchQuery.trim()) params.search = searchQuery.trim();

            const response = await api.get('/products', { params });
            if (response.data && response.data.success) {
                setProducts(response.data.data);
            }
        } catch (err: any) {
            setError('Search failed. Please try again.');
            console.error(err);
        }
    };

    useEffect(() => {
        const loadPageData = async () => {
            try {
                if (id) {
                    const catResponse = await api.get(`/categories/${id}`);
                    if (catResponse.data && catResponse.data.success) {
                        if (catResponse.data.data.category) {
                            setCategory(catResponse.data.data.category);
                            setProducts(catResponse.data.data.products || []);
                        } else {
                            setCategory(catResponse.data.data);
                        }
                    }
                } else {
                    const productResponse = await api.get('/products');
                    if (productResponse.data && productResponse.data.success) {
                        setProducts(productResponse.data.data);
                    }
                }
            } catch (err) {
                console.error('Failed to load initial page data:', err);
                setError('Data could not be loaded. Please try again later.');
            }

            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }

            try {
                const cartResponse = await api.get('/cart');
                if (cartResponse.data && cartResponse.data.success) {
                    const cartData = cartResponse.data.data;
                    const total = cartData?.totalQuantity ?? cartResponse.data.totalQuantity ?? 0;
                    setQuantity(Number(total));
                }
            } catch (err) {
                console.error('Failed to load cart data:', err);
            }
        };

        loadPageData();
    }, [id]);

    return (
        <div className="max-w-6xl mx-auto p-6 text-left relative">
            <div className="absolute top-6 right-6 z-50">
                <Link
                    to="/cart"
                    className="relative flex items-center justify-center w-12 h-12 rounded-2xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300 shadow-sm group"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5 transition-transform group-hover:scale-110"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                    </svg>

                    {cartQuantity > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-white shadow-sm">
                            {cartQuantity}
                        </span>
                    )}
                </Link>
            </div>

            <div className="mb-6">
                <Link to="/categories" className="text-sm font-medium text-[var(--accent)] hover:underline">
                    ← Back to categories
                </Link>
            </div>

            <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--text-h)] md:text-4xl uppercase">
                        {category?.name || 'All Products'}
                    </h1>
                    <p className="mt-1 text-sm text-[var(--text)]/60">
                        Showing {products.length} products
                    </p>
                </div>

                <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-4 py-2 text-sm rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-[var(--accent)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity shadow-sm uppercase tracking-wider"
                    >
                        Search
                    </button>
                </form>
            </header>

            {error && (
                <div className="p-4 mb-6 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl font-medium flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-sm">
                    <span>{error}</span>
                    {error.includes('log in') && (
                        <div className="flex gap-3 text-xs font-bold uppercase tracking-wider">
                            <Link to="/login" className="px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:opacity-90 transition-opacity">
                                Login
                            </Link>
                            <Link to="/registration" className="px-3 py-1.5 border border-amber-500/30 hover:border-amber-500 rounded-lg transition-colors">
                                Register
                            </Link>
                        </div>
                    )}
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
                                <button onClick={() => handleClick(product._id)} className="px-4 py-2 bg-[var(--accent)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity shadow-sm">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && !error && (
                <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-2xl">
                    <p className="text-[var(--text)]">No products found...</p>
                </div>
            )}
        </div>
    );
}

export default App;