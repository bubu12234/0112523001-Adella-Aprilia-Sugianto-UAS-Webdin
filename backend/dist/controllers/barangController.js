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
exports.uploadFoto = exports.deleteBarang = exports.updateBarang = exports.createBarang = exports.getBarangById = exports.getBarang = void 0;
const database_1 = __importDefault(require("../config/database"));
const getBarang = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, filter, page, limit } = req.query;
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const offset = (pageNum - 1) * limitNum;
        let query = `
            SELECT b.*, k.nama_kategori 
            FROM barang b
            LEFT JOIN kategori_barang k ON b.kategori_id = k.id
            WHERE 1=1
        `;
        const queryParams = [];
        if (search) {
            query += ` AND (b.kode_barang LIKE ? OR b.nama_barang LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`);
        }
        if (filter) {
            query += ` AND (b.kondisi = ? OR k.nama_kategori = ?)`;
            queryParams.push(filter, filter);
        }
        const countQuery = `SELECT COUNT(*) as total FROM (${query}) as sub`;
        const [countResult] = yield database_1.default.query(countQuery, queryParams);
        const totalRows = countResult[0].total;
        query += ` ORDER BY b.id DESC LIMIT ? OFFSET ?`;
        queryParams.push(limitNum, offset);
        const [rows] = yield database_1.default.query(query, queryParams);
        res.status(200).json({
            data: rows,
            pagination: {
                total: totalRows,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(totalRows / limitNum)
            }
        });
    }
    catch (error) {
        console.error('getBarang error', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getBarang = getBarang;
const getBarangById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const query = `
            SELECT b.*, k.nama_kategori 
            FROM barang b
            LEFT JOIN kategori_barang k ON b.kategori_id = k.id
            WHERE b.id = ?
        `;
        const [rows] = yield database_1.default.query(query, [id]);
        if (rows.length === 0) {
            res.status(404).json({ message: 'Barang not found' });
            return;
        }
        res.status(200).json(rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getBarangById = getBarangById;
const createBarang = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const [result] = yield database_1.default.query(query, [kode_barang, nama_barang, kategori_id, kondisi, lokasi, jumlah, foto]);
        res.status(201).json({ message: 'Barang created successfully', id: result.insertId });
    }
    catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Kode barang already exists' });
        }
        else {
            console.error('createBarang error', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.createBarang = createBarang;
const updateBarang = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const [result] = yield database_1.default.query(query, queryParams);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Barang not found' });
            return;
        }
        res.status(200).json({ message: 'Barang updated successfully' });
    }
    catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Kode barang already exists' });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.updateBarang = updateBarang;
const deleteBarang = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM barang WHERE id = ?';
        const [result] = yield database_1.default.query(query, [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Barang not found' });
            return;
        }
        res.status(200).json({ message: 'Barang deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteBarang = deleteBarang;
const uploadFoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const foto = req.file ? req.file.filename : null;
        if (!foto) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }
        const query = 'UPDATE barang SET foto = ? WHERE id = ?';
        const [result] = yield database_1.default.query(query, [foto, id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Barang not found' });
            return;
        }
        res.status(200).json({ message: 'Foto uploaded successfully', foto });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.uploadFoto = uploadFoto;
