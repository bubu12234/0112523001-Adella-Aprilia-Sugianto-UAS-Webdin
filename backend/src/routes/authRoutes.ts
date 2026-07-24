import { Router } from 'express';
import { register, login, me, logout } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me);
router.post('/logout', logout);

export default router;
