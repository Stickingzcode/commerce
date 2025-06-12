import express, { Router, Request, Response, NextFunction } from 'express'

const router: Router = express.Router({ mergeParams: true });

const checkRole = (req: Request, res: Response, next: NextFunction) => {
    console.log('GOT to ROLE')
    next()
}

const getAll = (req: Request, res: Response, next: NextFunction) => {

    res.status(200).json({
        error: false,
        errors: [],
        data: {
            description: 'Get all Auth is successful'
        },
        message: 'successful',
        status: 200
    })

}

router.get('/', checkRole, getAll);
router.get('/create', checkRole, (req: Request, res: Response, next: NextFunction) => {

    res.status(200).json({
        error: false,
        errors: [],
        data: {
            description: 'Get auth create'
        },
        message: 'successful',
        status: 200
    })

});

export default router;