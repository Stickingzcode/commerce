import seedData from "./config/seeds/seeder.seed";
import connectDB from "./config/db.config";
import app from './config/app.config';

const init = async (): Promise<void> => {

    await connectDB();

    await seedData();

    process.setMaxListeners(20);

}

init()

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
    console.log(colors.yellow.bold(`Server listening on ${PORT}`));
});

process.on('unhandledRejection', (err: any, promise) => {
    console.log(colors.red(`Err: ${err.message}`));
    server.close(() => process.exit(1));
})