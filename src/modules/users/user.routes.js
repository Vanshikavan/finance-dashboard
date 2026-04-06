import { Router } from 'express';
import authenticate from '../../middlewares/auth.middleware.js';
import authorize from '../../middlewares/role.middleware.js';
import { getAllUsers, updateRole, updateStatus } from './user.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('ADMIN'), getAllUsers);
router.patch('/:id/role', authorize('ADMIN'), updateRole);
router.patch('/:id/status', authorize('ADMIN'), updateStatus);

export default router;