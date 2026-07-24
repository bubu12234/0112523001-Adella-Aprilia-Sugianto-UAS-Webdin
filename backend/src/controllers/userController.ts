import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import bcrypt from 'bcrypt';
import pool from '../config/database';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const query = 'SELECT id, nama, email, role, created_at, updated_at FROM users ORDER BY id ASC';
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nama, email, password, role } = req.body;
        if (!nama || !email || !password || !role) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)';
        const [result]: any = await pool.query(query, [nama, email, hashedPassword, role]);
        
        res.status(201).json({ message: 'User created successfully', id: result.insertId });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { nama, email, role, password } = req.body;

        if (!nama || !email || !role) {
            res.status(400).json({ message: 'Nama, email, and role are required' });
            return;
        }

        let query = 'UPDATE users SET nama = ?, email = ?, role = ?';
        const queryParams = [nama, email, role];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', password = ?';
            queryParams.push(hashedPassword);
        }

        query += ' WHERE id = ?';
        queryParams.push(id);

        const [result]: any = await pool.query(query, queryParams);
        
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (req.user && req.user.id.toString() === id) {
            res.status(400).json({ message: 'Cannot delete yourself' });
            return;
        }

        const query = 'DELETE FROM users WHERE id = ?';
        const [result]: any = await pool.query(query, [id]);
        
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            res.status(400).json({ message: 'New password is required' });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const query = 'UPDATE users SET password = ? WHERE id = ?';
        const [result]: any = await pool.query(query, [hashedPassword, id]);
        
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
