import { Router } from 'express';
import { getMe, postLogin, postRegister } from '../controllers/authController.js';
import { requireUser } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';

export const router = Router();

router.post('/register', rateLimit({ windowMs: 60000, max: 10 }), postRegister);
router.post('/login', rateLimit({ windowMs: 60000, max: 15 }), postLogin);
router.get('/me', requireUser, getMe);
