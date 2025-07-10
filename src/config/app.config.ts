import express, { Request, Response, NextFunction } from 'express'
import { config } from 'dotenv'
import bodyParser from 'body-parser'
import routes from '../routes/routes.router'
import morgan from 'morgan'
import errorHandler from '../middleware/error.middleware'

config() ///

const app = express();

// set view engine
app.set('view engine', 'ejs');

// set views folder
app.set('views', './views');

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: false }))

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))

app.use(morgan('dev'));

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

app.use(`${process.env.API_ROUTE}`, routes);

app.use(errorHandler)

export default app;