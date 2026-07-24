'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Barang {
    id: number;
    kode_barang: string;
    nama_barang: string;
    kategori_id: number;
    nama_kategori: string;
    kondisi: string;
    lokasi: string;
    jumlah: number;
    foto: string | null;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function BarangPage() {
    const { token, user } = useAuth();
    const [barangList, setBarangList] = useState<Barang[]>([]);
    const [kategoriList, setKategoriList] = useState<{id: number, nama_kategori: string}[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 5, totalPages: 1 });
    const [search, setSearch] = useState('');
    const [filterKondisi, setFilterKondisi] = useState('');
    const [filterKategori, setFilterKategori] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: 0,
        kode_barang: '',
        nama_barang: '',
        kategori_id: '',
        kondisi: 'Baik',
        lokasi: '',
        jumlah: 0,
    });
    const [file, setFile] = useState<File | null>(null);

    const fetchKategori = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/kategori', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setKategoriList(data);
        } catch (err) {}
    };

    const fetchBarang = async (page = 1) => {
        try {
            let url = `http://localhost:3000/api/barang?page=${page}&limit=${pagination.limit}`;
            if (search) url += `&search=${search}`;
            if (filterKondisi) url += `&kondisi=${filterKondisi}`;
            if (filterKategori) url += `&kategori=${filterKategori}`;

            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setBarangList(data.data);
                setPagination(data.pagination);
            }
        } catch (err) {}
    };

    useEffect(() => {
        if (token) {
            fetchKategori();
            fetchBarang();
        }
    }, [token, search, filterKondisi, filterKategori]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchBarang(newPage);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formDataObj = new FormData();
            formDataObj.append('kode_barang', formData.kode_barang);
            formDataObj.append('nama_barang', formData.nama_barang);
            formDataObj.append('kategori_id', formData.kategori_id.toString());
            formDataObj.append('kondisi', formData.kondisi);
            formDataObj.append('lokasi', formData.lokasi);
            formDataObj.append('jumlah', formData.jumlah.toString());
            if (file) formDataObj.append('foto', file);

            const url = isEditing 
                ? `http://localhost:3000/api/barang/${formData.id}`
                : 'http://localhost:3000/api/barang';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataObj
            });

            if (res.ok) {
                setShowForm(false);
                setFile(null);
                fetchBarang(pagination.page);
            } else {
                const data = await res.json();
                alert(data.message || 'Error saving data');
            }
        } catch (err) {
            alert('Error connecting to server');
        }
    };

    const handleEdit = (b: Barang) => {
        setFormData({
            id: b.id,
            kode_barang: b.kode_barang,
            nama_barang: b.nama_barang,
            kategori_id: b.kategori_id.toString(),
            kondisi: b.kondisi,
            lokasi: b.lokasi,
            jumlah: b.jumlah
        });
        setIsEditing(true);
        setShowForm(true);
        setFile(null);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus barang ini?')) return;
        try {
            const res = await fetch(`http://localhost:3000/api/barang/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchBarang(pagination.page);
            }
        } catch (err) {}
    };

    const handlePhotoUpload = async (id: number, file: File) => {
        const formData = new FormData();
        formData.append('foto', file);
        try {
            const res = await fetch(`http://localhost:3000/api/barang/${id}/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (res.ok) {
                fetchBarang(pagination.page);
            } else {
                alert('Gagal upload foto');
            }
        } catch (err) {
            alert('Error uploading foto');
        }
    };

    const canManage = user?.role === 'admin' || user?.role === 'operator';
    const canDelete = user?.role === 'admin';

    return (
        <div className="space-y-4 text-black">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Manajemen Inventaris Barang</h1>
                {canManage && (
                    <button 
                        onClick={() => {
                            setFormData({ id: 0, kode_barang: '', nama_barang: '', kategori_id: '', kondisi: 'Baik', lokasi: '', jumlah: 0 });
                            setIsEditing(false);
                            setShowForm(!showForm);
                        }}
                        className="bg-green-500 text-black px-3 py-1 border border-black"
                    >
                        {showForm ? 'Batal' : 'Tambah Barang'}
                    </button>
                )}
            </div>

            {showForm && (
                <div className="bg-gray-100 p-4 border border-black mb-4">
                    <h2 className="font-bold mb-2">{isEditing ? 'Edit Barang' : 'Tambah Barang'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
                        <div>
                            <label>Kode Barang:</label>
                            <input type="text" required value={formData.kode_barang} onChange={e => setFormData({...formData, kode_barang: e.target.value})} className="border border-black px-1 ml-2" />
                        </div>
                        <div>
                            <label>Nama Barang:</label>
                            <input type="text" required value={formData.nama_barang} onChange={e => setFormData({...formData, nama_barang: e.target.value})} className="border border-black px-1 ml-2" />
                        </div>
                        <div>
                            <label>Kategori:</label>
                            <select required value={formData.kategori_id} onChange={e => setFormData({...formData, kategori_id: e.target.value})} className="border border-black px-1 ml-2">
                                <option value="">Pilih Kategori</option>
                                {kategoriList.map(k => (
                                    <option key={k.id} value={k.id}>{k.nama_kategori}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Kondisi:</label>
                            <select required value={formData.kondisi} onChange={e => setFormData({...formData, kondisi: e.target.value})} className="border border-black px-1 ml-2">
                                <option value="Baik">Baik</option>
                                <option value="Rusak Ringan">Rusak Ringan</option>
                                <option value="Rusak Berat">Rusak Berat</option>
                            </select>
                        </div>
                        <div>
                            <label>Lokasi:</label>
                            <input type="text" required value={formData.lokasi} onChange={e => setFormData({...formData, lokasi: e.target.value})} className="border border-black px-1 ml-2" />
                        </div>
                        <div>
                            <label>Jumlah:</label>
                            <input type="number" required value={formData.jumlah} onChange={e => setFormData({...formData, jumlah: parseInt(e.target.value)})} className="border border-black px-1 ml-2" />
                        </div>
                        <div>
                            <label>Foto:</label>
                            <input type="file" accept="image/*" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} className="ml-2" />
                        </div>
                        <div className="mt-2">
                            <button type="submit" className="bg-green-500 text-black px-3 py-1 border border-black">Simpan Data</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    placeholder="Cari barang..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-black px-2 py-1"
                />
                <select 
                    value={filterKategori}
                    onChange={(e) => setFilterKategori(e.target.value)}
                    className="border border-black px-2 py-1"
                >
                    <option value="">Semua Kategori</option>
                    {kategoriList.map(k => (
                        <option key={k.id} value={k.nama_kategori}>{k.nama_kategori}</option>
                    ))}
                </select>
                <select 
                    value={filterKondisi}
                    onChange={(e) => setFilterKondisi(e.target.value)}
                    className="border border-black px-2 py-1"
                >
                    <option value="">Semua Kondisi</option>
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                </select>
            </div>

            <table className="w-full border-collapse border border-black text-center">
                <thead className="bg-green-500 text-black">
                    <tr>
                        <th className="border border-black px-2 py-1">Foto</th>
                        <th className="border border-black px-2 py-1">Kode</th>
                        <th className="border border-black px-2 py-1">Nama Barang</th>
                        <th className="border border-black px-2 py-1">Kategori</th>
                        <th className="border border-black px-2 py-1">Kondisi</th>
                        <th className="border border-black px-2 py-1">Lokasi</th>
                        <th className="border border-black px-2 py-1">Jumlah</th>
                        {canManage && <th className="border border-black px-2 py-1">Aksi</th>}
                    </tr>
                </thead>
                <tbody>
                    {barangList.map((b) => (
                        <tr key={b.id}>
                            <td className="border border-black px-2 py-1">
                                {b.foto ? (
                                    <div className="flex flex-col items-center gap-1">
                                        <img 
                                            src={`http://localhost:3000/uploads/${b.foto}`} 
                                            alt={b.nama_barang} 
                                            className="h-10 w-10 object-cover inline bg-gray-200"
                                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/40x40/eeeeee/999999?text=404' }}
                                        />
                                        {canManage && (
                                            <label className="text-[10px] text-green-600 underline cursor-pointer">
                                                Ganti
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                    if (e.target.files?.[0]) handlePhotoUpload(b.id, e.target.files[0]);
                                                }} />
                                            </label>
                                        )}
                                    </div>
                                ) : (
                                    canManage ? (
                                        <label className="text-[10px] bg-green-500 text-black px-1 py-0.5 border border-black cursor-pointer inline-block mt-1">
                                            Upload
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                if (e.target.files?.[0]) handlePhotoUpload(b.id, e.target.files[0]);
                                            }} />
                                        </label>
                                    ) : (
                                        <span>-</span>
                                    )
                                )}
                            </td>
                            <td className="border border-black px-2 py-1">{b.kode_barang}</td>
                            <td className="border border-black px-2 py-1">{b.nama_barang}</td>
                            <td className="border border-black px-2 py-1">{b.nama_kategori}</td>
                            <td className="border border-black px-2 py-1">{b.kondisi}</td>
                            <td className="border border-black px-2 py-1">{b.lokasi}</td>
                            <td className="border border-black px-2 py-1">{b.jumlah}</td>
                            {canManage && (
                                <td className="border border-black px-2 py-1">
                                    <button onClick={() => handleEdit(b)} className="text-green-600 underline mr-2">Edit</button>
                                    {canDelete && <button onClick={() => handleDelete(b.id)} className="text-red-600 underline">Hapus</button>}
                                </td>
                            )}
                        </tr>
                    ))}
                    {barangList.length === 0 && (
                        <tr>
                            <td colSpan={canManage ? 8 : 7} className="border border-black px-2 py-4">Data tidak ditemukan.</td>
                        </tr>
                    )}
                </tbody>
            </table>


            {pagination.totalPages > 1 && (
                <div className="mt-4">
                    <span className="mr-4">Halaman {pagination.page} dari {pagination.totalPages}</span>
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="border border-black px-2 py-1 mr-2 disabled:opacity-50"
                    >
                        Sebelumnya
                    </button>
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="border border-black px-2 py-1 disabled:opacity-50"
                    >
                        Selanjutnya
                    </button>
                </div>
            )}
        </div>
    );
}
