'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Kategori {
    id: number;
    nama_kategori: string;
}

export default function KategoriPage() {
    const { token, user } = useAuth();
    const [kategori, setKategori] = useState<Kategori[]>([]);
    const [formData, setFormData] = useState({ id: 0, nama_kategori: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    const fetchKategori = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/kategori', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setKategori(data);
            }
        } catch (err) {
            console.error('Error fetching kategori');
        }
    };

    useEffect(() => {
        if (token) fetchKategori();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const url = isEditing 
                ? `http://localhost:3000/api/kategori/${formData.id}`
                : 'http://localhost:3000/api/kategori';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ nama_kategori: formData.nama_kategori })
            });

            if (res.ok) {
                setFormData({ id: 0, nama_kategori: '' });
                setIsEditing(false);
                fetchKategori();
            } else {
                const data = await res.json();
                setError(data.message || 'Gagal menyimpan data');
            }
        } catch (err) {
            setError('Terjadi kesalahan');
        }
    };

    const handleEdit = (k: Kategori) => {
        setFormData({ id: k.id, nama_kategori: k.nama_kategori });
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah anda yakin?')) return;
        try {
            const res = await fetch(`http://localhost:3000/api/kategori/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchKategori();
            } else {
                const data = await res.json();
                alert(data.message);
            }
        } catch (err) {
            alert('Terjadi kesalahan');
        }
    };

    const canManage = user?.role === 'admin' || user?.role === 'operator';
    const canDelete = user?.role === 'admin';

    return (
        <div className="space-y-4 text-black">
            <h1 className="text-xl font-bold">Manajemen Kategori Barang</h1>
            
            {canManage && (
                <div className="bg-gray-100 p-4 border border-black mb-4">
                    <h2 className="font-bold mb-2">
                        {isEditing ? 'Edit Kategori' : 'Tambah Kategori'}
                    </h2>
                    {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                        <label>Nama Kategori:</label>
                        <input
                            type="text"
                            required
                            value={formData.nama_kategori}
                            onChange={(e) => setFormData({ ...formData, nama_kategori: e.target.value })}
                            className="border border-black px-1"
                        />
                        <button
                            type="submit"
                            className="bg-green-500 text-black px-3 py-1 border border-black"
                        >
                            {isEditing ? 'Update' : 'Simpan'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({ id: 0, nama_kategori: '' });
                                }}
                                className="bg-gray-200 text-black px-3 py-1 border border-black"
                            >
                                Batal
                            </button>
                        )}
                    </form>
                </div>
            )}

            <table className="w-full border-collapse border border-black text-center">
                <thead className="bg-green-500 text-black">
                    <tr>
                        <th className="border border-black px-2 py-1">No</th>
                        <th className="border border-black px-2 py-1">Nama Kategori</th>
                        {canManage && (
                            <th className="border border-black px-2 py-1">Aksi</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {kategori.map((k, index) => (
                        <tr key={k.id}>
                            <td className="border border-black px-2 py-1">{index + 1}</td>
                            <td className="border border-black px-2 py-1">{k.nama_kategori}</td>
                            {canManage && (
                                <td className="border border-black px-2 py-1">
                                    <button onClick={() => handleEdit(k)} className="text-green-600 underline mr-2">Edit</button>
                                    {canDelete && (
                                        <button onClick={() => handleDelete(k.id)} className="text-red-600 underline">Hapus</button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                    {kategori.length === 0 && (
                        <tr>
                            <td colSpan={canManage ? 3 : 2} className="border border-black px-2 py-4">Data tidak ditemukan.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
