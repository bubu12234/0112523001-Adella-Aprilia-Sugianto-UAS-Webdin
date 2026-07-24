'use client';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function Dashboard() {
    const { user, token } = useAuth();
    const [stats, setStats] = useState({ total: 0, baik: 0, rusak: 0 });

    useEffect(() => {
        if (token) {
            fetch('http://localhost:3000/api/barang/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => {
                if (data.total !== undefined) {
                    setStats(data);
                }
            })
            .catch(err => console.error(err));
        }
    }, [token]);

    return (
        <div className="text-black space-y-4">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p>Selamat datang di Sistem Manajemen Inventaris Laboratorium Komputer.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 border border-black text-center">
                    <h3 className="font-bold">Total Barang</h3>
                    <p className="text-2xl mt-2 font-bold text-green-600">{stats.total}</p>
                </div>
                <div className="p-4 border border-black text-center">
                    <h3 className="font-bold">Barang Baik</h3>
                    <p className="text-2xl mt-2 font-bold text-green-600">{stats.baik}</p>
                </div>
                <div className="p-4 border border-black text-center">
                    <h3 className="font-bold">Barang Rusak</h3>
                    <p className="text-2xl mt-2 font-bold text-green-600">{stats.rusak}</p>
                </div>
            </div>
            
            <div className="mt-8">
                <h3 className="font-bold mb-2">Informasi Akun Anda</h3>
                <ul className="p-4 border border-black list-none">
                    <li><strong>Nama:</strong> {user?.nama}</li>
                    <li><strong>Email:</strong> {user?.email}</li>
                    <li><strong>Role:</strong> {user?.role.toUpperCase()}</li>
                </ul>
            </div>
        </div>
    );
}
