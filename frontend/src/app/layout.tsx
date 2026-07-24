'use client';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLogin = pathname === '/login';

    return (
        <html lang="en">
            <title>Labora - Inventaris Lab</title>
            <body className={`${inter.className} bg-gray-50 min-h-screen`}>
                <AuthProvider>
                    {!isLogin && <Navbar />}
                    <main className={!isLogin ? "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" : ""}>
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}
