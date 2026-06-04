import React, { useState } from 'react';
import api from "../services/api.ts";
import { useNavigate } from 'react-router-dom';

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    [key: string]: string | undefined;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

const RegistrationForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validate = (): boolean => {
        const tempErrors: FormErrors = {};

        if (!formData.email) {
            tempErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Invalid email address';
        }

        if (!formData.password) {
            tempErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            tempErrors.password = 'Password must be at least 6 characters long';
        }

        if (formData.confirmPassword !== formData.password) {
            tempErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate()) {
            alert('Registration successfully');
            console.log('Form Submitted Data:', {
                email: formData.email,
                password: formData.password,
            });

            const register = async () => {
                try {
                    const response = await api.post('/auth/register', { email: formData.email, password: formData.password });

                    if (response.data.success) {
                        alert('Welcome! Registration successful.');
                        const token = response.data.data.token;
                        localStorage.setItem('token', token);
                        navigate('/categories');
                    }
                } catch (err: any) {
                    console.error(err);
                }
            };

            register();
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md p-8 border border-[var(--border)] rounded-xl bg-[var(--bg)] shadow-sm">

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--text-h)]">
                        Create an account
                    </h2>
                    <p className="mt-2 text-sm text-[var(--text)]">
                        Already have an account?{' '}
                        <a href="/login" className="text-[var(--accent)] hover:underline font-medium">
                            Sign in
                        </a>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-h)] mb-1.5 text-left">
                            Email address
                        </label>
                        <input
                            type="email"
                            required
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--bg)] text-[var(--text-h)] placeholder:text-[var(--text)]/50 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 text-left">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-h)] mb-1.5 text-left">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--bg)] text-[var(--text-h)] placeholder:text-[var(--text)]/50 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1 text-left">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-h)] mb-1.5 text-left">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            required
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--bg)] text-[var(--text-h)] placeholder:text-[var(--text)]/50 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1 text-left">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2.5 px-4 bg-[var(--accent)] text-white font-medium rounded-md hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Register
                    </button>

                </form>
            </div>
        </div>
    );
}

export default RegistrationForm;