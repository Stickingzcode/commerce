import express, { Router } from 'express'
import {
    register,
    activateAccount,
    login
} from '../../controllers/auth.controller'

const router: Router = express.Router({ mergeParams: true });

router.post('/register', register)
router.post('/login', login)

router.put('/activate', activateAccount)

export default router;