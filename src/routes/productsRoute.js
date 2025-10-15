import { Router } from 'express';
import * as ctrl from '../controllers/productController.js';
import { requireAdmin } from '../middleware/auth.js';

export const router = Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);

router.post('/', requireAdmin, ctrl.create);
router.put('/:id', requireAdmin, ctrl.update);
router.delete('/:id', requireAdmin, ctrl.remove);
