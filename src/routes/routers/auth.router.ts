import express, { Router } from 'express'
import {
    register,
    activateAccount
} from '../../controllers/auth.controller'

const router: Router = express.Router({ mergeParams: true });

router.post('/register', register)

router.put('/activate', activateAccount)

export default router;