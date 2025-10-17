import mongoose, {ConnectOptions} from "mongoose"
import colors from 'colors';

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
        
        if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
            const dbConnection = await mongoose.connect(process.env.MONGODB_URI || '', options)
            console.log(colors.cyan.bold(`Database connected successfully: ${dbConnection.connection.host}`))
        }
    } catch (error) {
        console.log(colors.red.bold(`DB connection error: ${error}`))
    }
}

export default connectDB;