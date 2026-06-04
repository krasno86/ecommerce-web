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

interface CartItem {
    product: Product;
    quantity: number;
}

function App() {
    const [error, setError] = useState<string>('');
    const [products, setProducts] = useState<CartItem[]>([]);
    const [cartQuantity, setQuantity] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [isOrdered, setIsOrdered] = useState<boolean>(false);

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart');
            if (response.data.success) {
                setProducts(response.data.data?.items || []);
                setQuantity(response.data.totalQuantity || 0);
                setTotalAmount(response.data.totalAmount || 0);
            }
        } catch (err: any) {
            setError('Failed to load cart data. Please check if the backend server is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleIncrease = async (productId: string) => {
        try {
            const response = await api.post('/cart', { productId, quantity: 1 });
            if (response.data.success) {
                fetchCart();
            }
        } catch (err) {
            console.error('Error adding item to cart:', err);
        }
    };

    const handleDecrease = async (productId: string) => {
        try {
            const response = await api.delete(`/cart/${productId}`);
            if (response.data.success) {
                fetchCart();
            }
        } catch (err) {
            console.error('Error deleting item from cart:', err);
        }
    };

    const handleRemoveGroup = async (productId: string) => {
        try {
            const response = await api.delete(`/cart/${productId}/group`);
            if (response.data.success) {
                fetchCart();
            }
        } catch (err) {
            console.error('Error deleting item from cart:', err);
        }
    };

    const handleCheckout = async () => {
        try {
            const response = await api.post('/orders', {
                shippingAddress: "SomeStreet 22, Hamburg"
            });

            if (response.data.success) {
                setIsOrdered(true);
                setProducts([]);
                setQuantity(0);
                setTotalAmount(0);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Order creation failed.');
            console.error(err);
        }
    };

    if (loading) {
        return <div className="text-center py-20 font-medium text-[var(--text)]/70">Loading cart...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500 font-medium">{error}</div>;
    }

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

            {isOrdered ? (
                <div className="text-center py-16 px-4 border border-[var(--border)] rounded-2xl bg-[var(--bg)] shadow-sm max-w-md mx-auto mt-8 space-y-5">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
                        ✓
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-[var(--text-h)] uppercase tracking-tight">Order Processed!</h2>
                        <p className="text-sm text-[var(--text)]/70">
                            Thank you for your purchase. Your order has been successfully created and sent to our team.
                        </p>
                    </div>
                    <div className="pt-2">
                        <Link
                            to="/categories"
                            onClick={() => setIsOrdered(false)}
                            className="inline-block w-full py-3 bg-[var(--accent)] text-white font-bold text-xs rounded-xl uppercase tracking-wider hover:opacity-95 transition-opacity text-center"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-[var(--border)] rounded-2xl mt-8">
                    <p className="text-[var(--text)]/70 mb-4">Your shopping cart is completely empty</p>
                    <Link to="/categories" className="px-6 py-2.5 bg-[var(--accent)] text-white font-bold text-xs rounded-xl uppercase inline-block">
                        Go Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    <div className="lg:col-span-8 space-y-4">
                        {products.map((item) => (
                            <div key={item.product?._id}
                                 className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-[var(--border)] rounded-2xl bg-[var(--bg)] shadow-sm">

                                <div className="w-24 h-24 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 border border-[var(--border)]/50">
                                    <img
                                        src={
                                            item.product?.images?.[0]
                                                ? `http://localhost:3000${item.product.images[0]}`
                                                : "https://placehold.co/100x100?text=No+Image"
                                        }
                                        alt={item.product?.title || "Product"}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-lg font-bold text-[var(--text-h)]">{item.product?.title || "Unknown Product"}</h3>
                                    <p className="text-sm text-[var(--text)]/60 font-mono mt-0.5">${item.product?.price || 0}</p>
                                </div>

                                <div className="flex items-center border border-[var(--border)] rounded-xl bg-[var(--bg)] overflow-hidden">
                                    <button onClick={() => handleDecrease(item.product._id)}
                                            className="px-3 py-1.5 text-lg font-bold text-[var(--text)]/70 hover:bg-[var(--border)]/20 transition-colors">
                                        −
                                    </button>
                                    <span className="px-3 font-mono font-bold text-sm text-[var(--text-h)]">
                                        {item.quantity}
                                    </span>
                                    <button onClick={() => handleIncrease(item.product._id)}
                                            className="px-3 py-1.5 text-lg font-bold text-[var(--text)]/70 hover:bg-[var(--border)]/20 transition-colors">
                                        +
                                    </button>
                                </div>

                                <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-1 pl-4 sm:border-l border-[var(--border)]/40">
                                    <span className="text-xs text-[var(--text)]/40">Subtotal:</span>
                                    <span className="font-mono font-black text-lg text-[var(--text-h)]">
                                        ${(item.product?.price || 0) * item.quantity}
                                    </span>
                                    <button onClick={() => handleRemoveGroup(item.product._id)}
                                            className="text-xs font-semibold text-red-500 hover:underline mt-1">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-4 p-6 border border-[var(--border)] rounded-2xl bg-[var(--bg)] shadow-sm space-y-6 lg:sticky lg:top-6">
                        <h2 className="text-xl font-bold text-[var(--text-h)] border-b border-[var(--border)]/40 pb-3">
                            Order Summary
                        </h2>

                        <div className="space-y-3 font-medium text-sm text-[var(--text)]">
                            <div className="flex justify-between">
                                <span className="opacity-70">Subtotal</span>
                                <span className="font-mono text-[var(--text-h)]">${totalAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-70">Shipping</span>
                                <span className="text-green-500 font-semibold">FREE</span>
                            </div>
                            <hr className="border-[var(--border)]/40 my-2"/>
                            <div className="flex justify-between items-baseline">
                                <span className="text-base font-bold text-[var(--text-h)]">Total Amount</span>
                                <span className="font-mono font-black text-2xl text-[var(--accent)]">${totalAmount}</span>
                            </div>
                        </div>

                        <button onClick={handleCheckout}
                                className="w-full py-3.5 bg-[var(--accent)] text-white font-bold text-sm rounded-xl hover:opacity-95 shadow-sm transition-opacity uppercase tracking-wider">
                            Proceed to Checkout
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}

export default App;