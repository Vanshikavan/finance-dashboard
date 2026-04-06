import { Router } from 'express';
import authenticate from '../../middlewares/auth.middleware.js';
import authorize from '../../middlewares/role.middleware.js';
import { getSummary, getByCategory, getMonthlyTrends, getRecent, getInsights } from './dashboard.controller.js';

const router = Router();

router.use(authenticate);
router.use(authorize('ANALYST', 'ADMIN'));

router.get('/summary', getSummary);
router.get('/by-category', getByCategory);
router.get('/trends', getMonthlyTrends);
router.get('/recent', getRecent);
router.get('/insights', getInsights);

export default router;