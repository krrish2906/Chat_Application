import mongoose, { mongo } from 'mongoose';
import { serverConfig } from './serverConfig.js'

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("MongoDB connected successfully");
        })
        await mongoose.connect(`${serverConfig.MONGODB_URI}`)
    } catch (error) {
        console.log("Error connecting MongoDB: ", error)
    }
}

export default connectDB;