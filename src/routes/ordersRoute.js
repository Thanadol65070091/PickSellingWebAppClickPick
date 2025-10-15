import { Router } from 'express';
import * as ctrl from '../controllers/orderController.js';
import { requireAdmin, requireUser } from '../middleware/auth.js';

export const router = Router();

router.get('/orders', requireUser, ctrl.list);
router.get('/orders/:id', requireUser, ctrl.getOne);
router.post('/payment', requireUser, ctrl.postPayment);
router.post('/orders/:id/ship', requireAdmin, ctrl.ship);
router.post('/orders/:id/deliver', requireAdmin, ctrl.deliver);
