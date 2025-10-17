import bodyParser from 'body-parser';
import express, { Request, Response, NextFunction} from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import errorHandler from '../middlewares/error.middleware';
import routes from "../routes/routes.router";

config();

const app = express();

app.set('view engine', 'ejs');

app.set('views', './views');

app.use(express.json({ limit: '50mb'}))

app.use(express.urlencoded({ limit: '50mb', extended: false}))

app.use(bodyParser.json({ limit: '50mb'}))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false}))

// if(ENV.isDev || ENV.isStaging) {
//     app.use(morgan('dev'));
// }

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        error: false,
        errors: [],
        data: {
            name: '',
            version: '',
            author: ''
        },
        message: 'successful',
        status: 200,
    })
})

app.use(`${process.env.API_ROUTE}`, routes);

app.use(errorHandler);

export default app;