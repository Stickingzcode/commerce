import express, { Request, Response, Router, NextFunction } from 'express';
import authRoutes from './routers/auth.router';
import userRoutes from './routers/user.router';

const router: Router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;