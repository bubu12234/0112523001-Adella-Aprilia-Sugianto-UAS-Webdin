import { Router } from 'express';
import { getKategori, getKategoriById, createKategori, updateKategori, deleteKategori } from '../controllers/kategoriController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.get('/', authMiddleware, getKategori);
router.get('/:id', authMiddleware, getKategoriById);

router.post('/', authMiddleware, roleMiddleware(['admin', 'operator']), createKategori);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'operator']), updateKategori);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteKategori);
export default router;
