import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';


interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: string[];
    createdAt?: string;
    updatedAt?: string;
}

function App() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');

                if (response.data.success) {
                    setCategories(response.data.data);
                    console.log(response.data.data);
                }
            } catch (err: any) {
                setError('Failed to load categories. Please check if the backend server is running.');
                console.error(err);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-6 min-h-[85vh] flex flex-col justify-center">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-black tracking-tight text-[var(--text-h)] md:text-5xl uppercase">
                    Our Collection
                </h1>
                <div className="w-12 h-1 bg-[var(--accent)] mx-auto mt-4 rounded-full"></div>
                <p className="mt-4 text-sm text-[var(--text)]/70 uppercase tracking-widest font-medium">
                    Select a category to explore products
                </p>
            </header>

            {error && (
                <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className="group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg)] shadow-md hover:shadow-xl hover:border-[var(--accent)]/30 transition-all duration-500 cursor-pointer"
                    >
                        <Link to={`/products/${category._id}`} className="group/link flex-1 focus:outline-none text-left">

                            <div className="aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                                {category.image && category.image.length > 0 ? (
                                    <img
                                        src={`http://localhost:3000${category.image[0]}`}
                                        alt={category.name}
                                        className="h-full w-full object-cover object-center scale-100 group-hover:scale-102 transition-transform duration-700 ease-out"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x450?text=No+Image';
                                        }}
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-zinc-400">
                                        No image
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-1 flex-col p-6 bg-gradient-to-b from-transparent to-black/[0.02] dark:to-white/[0.01]">
                                <div className="flex items-center justify-between gap-4 w-full">
                                    <h2 className="text-2xl font-extrabold text-[var(--text-h)] group-hover/link:text-[var(--accent)] transition-colors duration-300">
                                        {category.name}
                                    </h2>

                                    <div className="w-10 h-10 shrink-0 rounded-full border border-[var(--border)] flex items-center justify-center bg-[var(--bg)] group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] text-[var(--text-h)] group-hover:text-white transition-all duration-300 shadow-sm">
                                        <span className="text-xl font-light transform transition-transform group-hover:translate-x-0.5">→</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {categories.length === 0 && !error && (
                <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-2xl">
                    <p className="text-[var(--text)]">No categories found or the database is empty...</p>
                </div>
            )}
        </div>
    );
}

export default App;