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
exports.resetPassword = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../config/database"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT id, nama, email, role, created_at, updated_at FROM users ORDER BY id DESC';
        const [rows] = yield database_1.default.query(query);
        res.status(200).json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getUsers = getUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nama, email, password, role } = req.body;
        if (!nama || !email || !password || !role) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const query = 'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)';
        const [result] = yield database_1.default.query(query, [nama, email, hashedPassword, role]);
        res.status(201).json({ message: 'User created successfully', id: result.insertId });
    }
    catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Email already exists' });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            query += ', password = ?';
            queryParams.push(hashedPassword);
        }
        query += ' WHERE id = ?';
        queryParams.push(id);
        const [result] = yield database_1.default.query(query, queryParams);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User updated successfully' });
    }
    catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Email already exists' });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Prevent deleting oneself
        if (req.user && req.user.id.toString() === id) {
            res.status(400).json({ message: 'Cannot delete yourself' });
            return;
        }
        const query = 'DELETE FROM users WHERE id = ?';
        const [result] = yield database_1.default.query(query, [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteUser = deleteUser;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        if (!newPassword) {
            res.status(400).json({ message: 'New password is required' });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        const query = 'UPDATE users SET password = ? WHERE id = ?';
        const [result] = yield database_1.default.query(query, [hashedPassword, id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'Password reset successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.resetPassword = resetPassword;
