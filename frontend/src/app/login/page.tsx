'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                login(data.token, data.user);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Terjadi kesalahan pada server');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                        Login Sistem
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Inventaris Laboratorium Komputer
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit} autoComplete="off">

                    <input type="text" name="fakeusernameremembered" style={{display: 'none'}} />
                    <input type="password" name="fakepasswordremembered" style={{display: 'none'}} />
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                required
                                autoComplete="off"
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm mt-1"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                autoComplete="new-password"
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm mt-1"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
