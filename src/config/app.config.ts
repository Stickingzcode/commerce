import express, { Request, Response, NextFunction } from 'express'
import { config } from 'dotenv'
import bodyParser from 'body-parser'
import routes from '../routes/routes.router'

config() ///

const app = express();

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: false }))

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))

app.get('/', (req: Request, res: Response, next: NextFunction) => {

    res.status(200).json({
        error: false,
        errors: [],
        data: {
            name: 'commerce-backend-api',
            version: '1.0.0',
            author: 'Concreap'
        },
        message: 'successful',
        status: 200
    })

})

app.use('/v1', routes);
export default app;