import { Router } from 'express';
import {
  recommend,
  history,
} from '../controllers/recommend.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Semua endpoint /recommend butuh login
router.post('/', authMiddleware, recommend);
router.get('/history', authMiddleware, history);

export default router;
