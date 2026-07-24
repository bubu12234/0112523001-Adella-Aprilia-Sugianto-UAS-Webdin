"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const barangController_1 = require("../controllers/barangController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const router = (0, express_1.Router)();
// Viewer, Operator, Admin can read
router.get('/', authMiddleware_1.authMiddleware, barangController_1.getBarang);
router.get('/:id', authMiddleware_1.authMiddleware, barangController_1.getBarangById);
// Admin and Operator can create and update
router.post('/', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(['admin', 'operator']), uploadMiddleware_1.upload.single('foto'), barangController_1.createBarang);
router.put('/:id', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(['admin', 'operator']), uploadMiddleware_1.upload.single('foto'), barangController_1.updateBarang);
// Only Admin can delete
router.delete('/:id', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(['admin']), barangController_1.deleteBarang);
// Upload endpoint
router.post('/:id/upload', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(['admin', 'operator']), uploadMiddleware_1.upload.single('foto'), barangController_1.uploadFoto);
exports.default = router;
