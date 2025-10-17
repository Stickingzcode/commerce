import express, { Router } from 'express';
import { register } from '../../controllers/auth.controller';

const router: Router = express.Router({ mergeParams: true });

router.post('/register', register);


export default router;