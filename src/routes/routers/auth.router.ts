import express, { Router } from 'express'
import {
    register,
    activateAccount,
    login
} from '../../controllers/auth.controller'
import { validateChannels as vc } from '../../middleware/header.middleware';

const router: Router = express.Router({ mergeParams: true });

router.post('/register', register)
router.post('/login', vc, login)

router.put('/activate', activateAccount)

export default router;