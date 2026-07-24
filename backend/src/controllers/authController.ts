import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey123';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nama, email, password, role } = req.body;
        if (!nama || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role || 'viewer';

        const query = 'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(query, [nama, email, hashedPassword, userRole]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            console.error('Register error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows]: any = await pool.query(query, [email]);

        if (rows.length === 0) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, nama: user.nama },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const me = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const query = 'SELECT id, nama, email, role, created_at, updated_at FROM users WHERE id = ?';
        const [rows]: any = await pool.query(query, [userId]);

        if (rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ message: 'Logout successful' });
};
