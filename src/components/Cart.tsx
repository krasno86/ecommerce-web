import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

interface Product {
    _id: string;
    title: string;
    price: number;
    description: string;
    images: string[];
}

interface Cart {
    _id: string;
    user: string;
    price: number;
    items: object[];
}

function App() {
    const [cart, setCart] = useState<Cart[]>([]);
    const [error, setError] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [cartQuantity, setQuantity] = useState<number>(0);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await api.get('/cart');

                if (response.data.success) {
                    setCart(response.data.data);
                    setProducts(response.data.data.items);
                    setQuantity(response.data.totalQuantity);
                    console.log(cart, error);
                }
            } catch (err: any) {
                setError('Failed to load categories. Please check if the backend server is running.');
                console.error(err);
            }
        };

        fetchCart();
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-6 text-left">
            <div className="mb-6">
                <Link to="/categories" className="text-sm font-medium text-[var(--accent)] hover:underline">
                    ← Continue Shopping
                </Link>
            </div>

            <header className="mb-10">
                <h1 className="text-3xl font-black tracking-tight text-[var(--text-h)] md:text-4xl uppercase">
                    Shopping Cart
                </h1>
                <p className="mt-1 text-sm text-[var(--text)]/60">
                    You have {cartQuantity} items in your cart
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                <div className="lg:col-span-8 space-y-4">
                    {(products as any[]).map((product: any) => (
                        <div key={product.product._id}
                            className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-[var(--border)] rounded-2xl bg-[var(--bg)] shadow-sm">
                            <div
                                className="w-24 h-24 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 border border-[var(--border)]/50">
                                <img
                                    src="http://localhost:3000/uploads/image-1780396760365-270209188.webp"
                                    alt="OnePlus 15"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-lg font-bold text-[var(--text-h)]">{product.product.title}</h3>
                                <p className="text-sm text-[var(--text)]/60 font-mono mt-0.5">${product.product.price}</p>
                            </div>

                            <div
                                className="flex items-center border border-[var(--border)] rounded-xl bg-[var(--bg)] overflow-hidden">
                                <button
                                    className="px-3 py-1.5 text-lg font-bold text-[var(--text)]/70 hover:bg-[var(--border)]/20 transition-colors">
                                    −
                                </button>
                                <span className="px-3 font-mono font-bold text-sm text-[var(--text-h)]">
                                    {product.quantity}
                                </span>
                                <button
                                    className="px-3 py-1.5 text-lg font-bold text-[var(--text)]/70 hover:bg-[var(--border)]/20 transition-colors">
                                    +
                                </button>
                            </div>

                            {/* Итоговая стоимость этой позиции и кнопка удаления */}
                            <div
                                className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-1 pl-4 sm:border-l border-[var(--border)]/40">
                                <span className="font-mono font-black text-lg text-[var(--text-h)]">
                                    $1998
                                </span>
                                <button className="text-xs font-semibold text-red-500 hover:underline">
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    className="lg:col-span-4 p-6 border border-[var(--border)] rounded-2xl bg-[var(--bg)] shadow-sm space-y-6 lg:sticky lg:top-6">
                    <h2 className="text-xl font-bold text-[var(--text-h)] border-b border-[var(--border)]/40 pb-3">
                        Order Summary
                    </h2>

                    <div className="space-y-3 font-medium text-sm text-[var(--text)]">
                        <div className="flex justify-between">
                            <span className="opacity-70">Subtotal</span>
                            <span className="font-mono text-[var(--text-h)]">$1998</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="opacity-70">Shipping</span>
                            <span className="text-green-500 font-semibold">FREE</span>
                        </div>
                        <hr className="border-[var(--border)]/40 my-2"/>
                        <div className="flex justify-between items-baseline">
                            <span className="text-base font-bold text-[var(--text-h)]">Total Amount</span>
                            <span className="font-mono font-black text-2xl text-[var(--accent)]">$1998</span>
                        </div>
                    </div>

                    <button
                        className="w-full py-3.5 bg-[var(--accent)] text-white font-bold text-sm rounded-xl hover:opacity-95 shadow-sm transition-opacity uppercase tracking-wider">
                        Proceed to Checkout
                    </button>
                </div>

            </div>

            {/* ЗАГЛУШКА: Если корзина пустая (Условие cart.items.length === 0) */}
            {/* <div className="text-center py-20 border border-dashed border-[var(--border)] rounded-2xl mt-8">
                <p className="text-[var(--text)]/70 mb-4">Your shopping cart is completely empty</p>
                <Link to="/categories" className="px-6 py-2.5 bg-[var(--accent)] text-white font-bold text-xs rounded-xl uppercase">
                    Go Shopping
                </Link>
            </div> */}
        </div>
    );
}

export default App;