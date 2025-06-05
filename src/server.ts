import app from './config/app.config'
import colors from 'colors'
import connectDB from './config/db.config'
import seedData from './config/seeds/seeder.seed'


const init = async (): Promise<void> => {

    // connect to database
    await connectDB()

    // log heap stats

    // seed data ( if available ) to database
    await seedData()

    // start cron jobs automatically

}

// initialize server
init()

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(colors.yellow.bold(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`))
});