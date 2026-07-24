"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.me = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey123';
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nama, email, password, role } = req.body;
        // Basic validation
        if (!nama || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const userRole = role || 'viewer';
        const query = 'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)';
        const [result] = yield database_1.default.query(query, [nama, email, hashedPassword, userRole]);
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Email already exists' });
        }
        else {
            console.error('Register error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = yield database_1.default.query(query, [email]);
        if (rows.length === 0) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const user = rows[0];
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, nama: user.nama }, JWT_SECRET, { expiresIn: '1d' });
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.login = login;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const query = 'SELECT id, nama, email, role, created_at, updated_at FROM users WHERE id = ?';
        const [rows] = yield database_1.default.query(query, [userId]);
        if (rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.me = me;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // In JWT, logout is usually handled client-side by deleting the token.
    // We can just send a success message.
    res.status(200).json({ message: 'Logout successful' });
});
exports.logout = logout;
