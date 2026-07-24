import { Request, Response } from 'express';
import pool from '../config/database';

export const getBarang = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search, kondisi, kategori, page, limit } = req.query;
        
        const pageNum = parseInt(page as string) || 1;
        const limitNum = parseInt(limit as string) || 10;
        const offset = (pageNum - 1) * limitNum;

        let query = `
            SELECT b.*, k.nama_kategori 
            FROM barang b
            LEFT JOIN kategori_barang k ON b.kategori_id = k.id
            WHERE 1=1
        `;
        const queryParams: any[] = [];

        if (search) {
            query += ` AND (b.kode_barang LIKE ? OR b.nama_barang LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        if (kondisi) {
            query += ` AND b.kondisi = ?`;
            queryParams.push(kondisi);
        }
        if (kategori) {
            query += ` AND k.nama_kategori = ?`;
            queryParams.push(kategori);
        }

        const countQuery = `SELECT COUNT(*) as total FROM (${query}) as sub`;
        const [countResult]: any = await pool.query(countQuery, queryParams);
        const totalRows = countResult[0].total;

        query += ` ORDER BY b.id ASC LIMIT ? OFFSET ?`;
        queryParams.push(limitNum, offset);

        const [rows] = await pool.query(query, queryParams);

        res.status(200).json({
            data: rows,
            pagination: {
                total: totalRows,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(totalRows / limitNum)
            }
        });
    } catch (error) {
        console.error('getBarang error', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getBarangById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const query = `
            SELECT b.*, k.nama_kategori 
            FROM barang b
            LEFT JOIN kategori_barang k ON b.kategori_id = k.id
            WHERE b.id = ?
        `;
        const [rows]: any = await pool.query(query, [id]);
        
        if (rows.length === 0) {
            res.status(404).json({ message: 'Barang not found' });
            return;
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createBarang = async (req: Request, res: Response): Promise<void> => {
    try {
        const { kode_barang, nama_barang, kategori_id, kondisi, lokasi, jumlah } = req.body;
        const foto = req.file ? req.file.filename : null;

        if (!kode_barang || !nama_barang || !kategori_id || !kondisi || !lokasi || !jumlah) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const query = `
            INSERT INTO barang (kode_barang, nama_barang, kategori_id, kondisi, lokasi, jumlah, foto)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result]: any = await pool.query(query, [kode_barang, nama_barang, kategori_id, kondisi, lokasi, jumlah, foto]);
        
        res.status(201).json({ message: 'Barang created successfully', id: result.insertId });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Kode barang already exists' });
        } else {
            console.error('createBarang error', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const updateBarang = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { kode_barang, nama_barang, kategori_id, kondisi, lokasi, jumlah } = req.body;
        const foto = req.file ? req.file.filename : null;

        if (!kode_barang || !nama_barang || !kategori_id || !kondisi || !lokasi || !jumlah) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        let query = `
            UPDATE barang 
            SET kode_barang = ?, nama_barang = ?, kategori_id = ?, kondisi = ?, lokasi = ?, jumlah = ?
        `;
        const queryParams = [kode_barang, nama_barang, kategori_id, kondisi, lokasi, jumlah];

        if (foto) {
            query += `, foto = ?`;
            queryParams.push(foto);
        }

        query += ` WHERE id = ?`;
        queryParams.push(id);

        const [result]: any = await pool.query(query, queryParams);
        
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Barang not found' });
            return;
        }
        
        res.status(200).json({ message: 'Barang updated successfully' });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Kode barang already exists' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const deleteBarang = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM barang WHERE id = ?';
        const [result]: any = await pool.query(query, [id]);
        
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Barang not found' });
            return;
        }
        
        res.status(200).json({ message: 'Barang deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const uploadFoto = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const foto = req.file ? req.file.filename : null;

        if (!foto) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const query = 'UPDATE barang SET foto = ? WHERE id = ?';
        const [result]: any = await pool.query(query, [foto, id]);
        
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Barang not found' });
            return;
        }

        res.status(200).json({ message: 'Foto uploaded successfully', foto });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const totalQuery = 'SELECT COUNT(*) as total FROM barang';
        const baikQuery = 'SELECT COUNT(*) as baik FROM barang WHERE kondisi = "Baik"';
        const rusakQuery = 'SELECT COUNT(*) as rusak FROM barang WHERE kondisi IN ("Rusak Ringan", "Rusak Berat")';
        
        const [totalResult]: any = await pool.query(totalQuery);
        const [baikResult]: any = await pool.query(baikQuery);
        const [rusakResult]: any = await pool.query(rusakQuery);
        
        res.status(200).json({
            total: totalResult[0].total,
            baik: baikResult[0].baik,
            rusak: rusakResult[0].rusak
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
