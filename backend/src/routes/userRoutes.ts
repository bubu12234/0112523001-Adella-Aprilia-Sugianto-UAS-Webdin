import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser, resetPassword } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authMiddleware, roleMiddleware(['admin']));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/:id/reset-password', resetPassword);

export default router;
