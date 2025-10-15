import { Router } from 'express';
import * as ctrl from '../controllers/cartController.js';
import { requireUser } from '../middleware/auth.js';

export const router = Router();

router.get('/cart', requireUser, ctrl.getCartDraft);
router.post('/cart/items', requireUser, ctrl.addCartItem);
router.put('/cart/items/:itemId', requireUser, ctrl.updateCartItem);
router.delete('/cart/items/:itemId', requireUser, ctrl.deleteCartItem);
router.post('/cart/recalculate', requireUser, ctrl.recalc);
router.post('/checkout', requireUser, ctrl.postCheckout);
