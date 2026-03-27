import mongoose from 'mongoose'
import 'dotenv/config'

async function connectDB() {
    try{
        mongoose.connect(process.env.MONGO_URI)
    } catch(err) {
        console.error(err.message)
    }
}
connectDB();