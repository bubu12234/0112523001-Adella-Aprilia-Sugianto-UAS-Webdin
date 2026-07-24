"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kategoriController_1 = require("../controllers/kategoriController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
// Viewer, Operator, Admin can read
router.get('/', authMiddleware_1.authMiddleware, kategoriController_1.getKategori);
router.get('/:id', authMiddleware_1.authMiddleware, kategoriController_1.getKategoriById);
// Only Operator and Admin can create/update/delete (wait, requirement says operator can tambah/edit barang/kategori, Admin can CRUD. Admin can also delete)
router.post('/', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(['admin', 'operator']), kategoriController_1.createKategori);
router.put('/:id', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(['admin', 'operator']), kategoriController_1.updateKategori);
router.delete('/:id', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(['admin']), kategoriController_1.deleteKategori); // Admin only delete, or Operator? Let's allow Admin only for delete, as requirement says "Admin: hapus data. Operator: Tambah dan edit barang/kategori". So Operator cannot delete.
exports.default = router;
