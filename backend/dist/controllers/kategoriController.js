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
exports.deleteKategori = exports.updateKategori = exports.createKategori = exports.getKategoriById = exports.getKategori = void 0;
const database_1 = __importDefault(require("../config/database"));
const getKategori = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM kategori_barang ORDER BY id DESC';
        const [rows] = yield database_1.default.query(query);
        res.status(200).json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getKategori = getKategori;
const getKategoriById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM kategori_barang WHERE id = ?';
        const [rows] = yield database_1.default.query(query, [id]);
        if (rows.length === 0) {
            res.status(404).json({ message: 'Kategori not found' });
            return;
        }
        res.status(200).json(rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getKategoriById = getKategoriById;
const createKategori = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nama_kategori } = req.body;
        if (!nama_kategori) {
            res.status(400).json({ message: 'nama_kategori is required' });
            return;
        }
        const query = 'INSERT INTO kategori_barang (nama_kategori) VALUES (?)';
        const [result] = yield database_1.default.query(query, [nama_kategori]);
        res.status(201).json({ message: 'Kategori created successfully', id: result.insertId });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createKategori = createKategori;
const updateKategori = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { nama_kategori } = req.body;
        if (!nama_kategori) {
            res.status(400).json({ message: 'nama_kategori is required' });
            return;
        }
        const query = 'UPDATE kategori_barang SET nama_kategori = ? WHERE id = ?';
        const [result] = yield database_1.default.query(query, [nama_kategori, id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Kategori not found' });
            return;
        }
        res.status(200).json({ message: 'Kategori updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateKategori = updateKategori;
const deleteKategori = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM kategori_barang WHERE id = ?';
        const [result] = yield database_1.default.query(query, [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Kategori not found' });
            return;
        }
        res.status(200).json({ message: 'Kategori deleted successfully' });
    }
    catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(400).json({ message: 'Cannot delete: category is in use by barang' });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.deleteKategori = deleteKategori;
