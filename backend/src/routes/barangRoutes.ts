import { Router } from 'express';
import { getBarang, getBarangById, createBarang, updateBarang, deleteBarang, uploadFoto, getDashboardStats } from '../controllers/barangController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

router.get('/', authMiddleware, getBarang);
router.get('/stats', authMiddleware, getDashboardStats);
router.get('/:id', authMiddleware, getBarangById);

router.post('/', authMiddleware, roleMiddleware(['admin', 'operator']), upload.single('foto'), createBarang);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'operator']), upload.single('foto'), updateBarang);

router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteBarang);

router.post('/:id/upload', authMiddleware, roleMiddleware(['admin', 'operator']), upload.single('foto'), uploadFoto);

export default router;
