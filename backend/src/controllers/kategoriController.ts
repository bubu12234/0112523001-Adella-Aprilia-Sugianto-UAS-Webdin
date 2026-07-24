import { Request, Response } from 'express';
import pool from '../config/database';

export const getKategori = async (req: Request, res: Response): Promise<void> => {
    try {
        const query = 'SELECT * FROM kategori_barang ORDER BY id ASC';
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getKategoriById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM kategori_barang WHERE id = ?';
        const [rows]: any = await pool.query(query, [id]);
        if (rows.length === 0) {
            res.status(404).json({ message: 'Kategori not found' });
            return;
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createKategori = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nama_kategori } = req.body;
        if (!nama_kategori) {
            res.status(400).json({ message: 'nama_kategori is required' });
            return;
        }
        const query = 'INSERT INTO kategori_barang (nama_kategori) VALUES (?)';
        const [result]: any = await pool.query(query, [nama_kategori]);
        res.status(201).json({ message: 'Kategori created successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateKategori = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { nama_kategori } = req.body;
        if (!nama_kategori) {
            res.status(400).json({ message: 'nama_kategori is required' });
            return;
        }
        const query = 'UPDATE kategori_barang SET nama_kategori = ? WHERE id = ?';
        const [result]: any = await pool.query(query, [nama_kategori, id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Kategori not found' });
            return;
        }
        res.status(200).json({ message: 'Kategori updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteKategori = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM kategori_barang WHERE id = ?';
        const [result]: any = await pool.query(query, [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Kategori not found' });
            return;
        }
        res.status(200).json({ message: 'Kategori deleted successfully' });
    } catch (error: any) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(400).json({ message: 'Cannot delete: category is in use by barang' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
