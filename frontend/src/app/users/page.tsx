'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface UserData {
    id: number;
    nama: string;
    email: string;
    role: string;
}

export default function UsersPage() {
    const { token, user } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<UserData[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ id: 0, nama: '', email: '', password: '', role: 'viewer' });
    const [showReset, setShowReset] = useState(false);
    const [resetData, setResetData] = useState({ id: 0, nama: '', newPassword: '' });

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
        }
        if (token && user?.role === 'admin') {
            fetchUsers();
        }
    }, [token, user, router]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setUsers(data);
        } catch (err) {}
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditing 
                ? `http://localhost:3000/api/users/${formData.id}`
                : 'http://localhost:3000/api/users';
            const method = isEditing ? 'PUT' : 'POST';

            const payload: any = {
                nama: formData.nama,
                email: formData.email,
                role: formData.role
            };
            if (!isEditing || formData.password) {
                payload.password = formData.password;
            }

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setShowForm(false);
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.message);
            }
        } catch (err) {
            alert('Error');
        }
    };

    const handleEdit = (u: UserData) => {
        setFormData({ id: u.id, nama: u.nama, email: u.email, password: '', role: u.role });
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus user ini?')) return;
        try {
            const res = await fetch(`http://localhost:3000/api/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchUsers();
            else {
                const data = await res.json();
                alert(data.message);
            }
        } catch (err) {}
    };

    const handleResetPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:3000/api/users/${resetData.id}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newPassword: resetData.newPassword })
            });

            if (res.ok) {
                alert('Password berhasil direset');
                setShowReset(false);
            } else {
                const data = await res.json();
                alert(data.message);
            }
        } catch (err) {
            alert('Error');
        }
    };

    if (user?.role !== 'admin') return null;

    return (
        <div className="space-y-4 text-black">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Manajemen Pengguna</h1>
                <button 
                    onClick={() => {
                        setFormData({ id: 0, nama: '', email: '', password: '', role: 'viewer' });
                        setIsEditing(false);
                        setShowForm(!showForm);
                        setShowReset(false);
                    }}
                    className="bg-green-500 text-black px-3 py-1 border border-black"
                >
                    {showForm ? 'Batal' : 'Tambah User'}
                </button>
            </div>

            {showForm && (
                <div className="bg-gray-100 p-4 border border-black mb-4">
                    <h2 className="font-bold mb-2">{isEditing ? 'Edit User' : 'Tambah User'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                            <label>Nama:</label>
                            <input type="text" required value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="border border-black px-1 ml-2" />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="border border-black px-1 ml-2" />
                        </div>
                        <div>
                            <label>{isEditing ? 'Password Baru:' : 'Password:'}</label>
                            <input type="password" required={!isEditing} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="border border-black px-1 ml-2" />
                        </div>
                        <div>
                            <label>Role:</label>
                            <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="border border-black px-1 ml-2">
                                <option value="admin">Admin</option>
                                <option value="operator">Operator</option>
                                <option value="viewer">Viewer</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 mt-2">
                            <button type="submit" className="bg-green-500 text-black px-3 py-1 border border-black">Simpan Data</button>
                        </div>
                    </form>
                </div>
            )}

            {showReset && (
                <div className="bg-gray-100 p-4 border border-black mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-bold">Reset Password untuk {resetData.nama}</h2>
                        <button onClick={() => setShowReset(false)} className="text-black underline">Tutup</button>
                    </div>
                    <form onSubmit={handleResetPasswordSubmit} className="flex gap-2 items-center">
                        <label>Password Baru:</label>
                        <input type="password" required value={resetData.newPassword} onChange={e => setResetData({...resetData, newPassword: e.target.value})} className="border border-black px-1" />
                        <button type="submit" className="bg-red-500 text-white px-3 py-1 border border-black">Reset</button>
                    </form>
                </div>
            )}

            <table className="w-full border-collapse border border-black text-center">
                <thead className="bg-green-500 text-black">
                    <tr>
                        <th className="border border-black px-2 py-1">ID</th>
                        <th className="border border-black px-2 py-1">Nama</th>
                        <th className="border border-black px-2 py-1">Email</th>
                        <th className="border border-black px-2 py-1">Role</th>
                        <th className="border border-black px-2 py-1">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td className="border border-black px-2 py-1">{String(u.id).padStart(4, '0')}</td>
                            <td className="border border-black px-2 py-1">{u.nama}</td>
                            <td className="border border-black px-2 py-1">{u.email}</td>
                            <td className="border border-black px-2 py-1">{u.role}</td>
                            <td className="border border-black px-2 py-1">
                                <button 
                                    onClick={() => {
                                        setResetData({ id: u.id, nama: u.nama, newPassword: '' });
                                        setShowReset(true);
                                        setShowForm(false);
                                    }} 
                                    className="text-orange-600 underline mr-2"
                                >
                                    Reset Pass
                                </button>
                                <button onClick={() => handleEdit(u)} className="text-green-600 underline mr-2">Edit</button>
                                <button onClick={() => handleDelete(u.id)} className="text-red-600 underline">Hapus</button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={5} className="border border-black px-2 py-4">Data tidak ditemukan.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
