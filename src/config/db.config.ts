import mongoose, { ConnectOptions } from "mongoose";
import colors from 'colors'

const options: ConnectOptions = {
    autoIndex: true,
    maxPoolSize: 60000,
    writeConcern: { wtimeout: 60000, wtimeoutMS: 60000 },
    connectTimeoutMS: 60000,
    socketTimeoutMS: 60000,
    serverSelectionTimeoutMS: 60000,
    family: 4,
}

const connectDB = async () => {

    try {

        if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production'){
            const dbConn = await mongoose.connect(process.env.MONGODB_URI || '', options)
            console.log(colors.cyan.bold(`Database Connected: ${dbConn.connection.host}`))
        }

    } catch (err) {
        console.log(colors.red.bold(`Databse connection error: ${err}`))
    }

}

export default connectDB;