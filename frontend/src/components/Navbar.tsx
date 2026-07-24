'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex space-x-8">
                        <div className="flex-shrink-0 flex items-center font-bold text-xl text-green-600">
                            Labora
                        </div>
                        <Link href="/dashboard" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-black hover:text-gray-700 hover:border-gray-300">
                            Dashboard
                        </Link>
                        <Link href="/barang" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-black hover:text-gray-700 hover:border-gray-300">
                            Barang
                        </Link>
                        <Link href="/kategori" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-black hover:text-gray-700 hover:border-gray-300">
                            Kategori
                        </Link>
                        {user.role === 'admin' && (
                            <Link href="/users" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-black hover:text-gray-700 hover:border-gray-300">
                                Users
                            </Link>
                        )}
                    </div>
                    <div className="flex items-center">

                        <button
                            onClick={logout}
                            className="bg-green-500 text-black px-3 py-1 border border-black"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
