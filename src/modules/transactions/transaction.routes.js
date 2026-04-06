import { Router } from 'express';
import authenticate from '../../middlewares/auth.middleware.js';
import authorize from '../../middlewares/role.middleware.js';
import { create, getAll, update, remove } from './transaction.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('VIEWER', 'ANALYST', 'ADMIN'), getAll);
router.post('/', authorize('ADMIN'), create);
router.patch('/:id', authorize('ADMIN'), update);
router.delete('/:id', authorize('ADMIN'), remove);

export default router;