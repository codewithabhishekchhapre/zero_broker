const mongoose = require('mongoose');

const connectdb = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        // const conn = await mongoose.connect(process.env.MONGO_URI, {});
        console.log("Attempting to connect to MongoDB...");

        const conn = await mongoose.connect(process.env.MONGO_URI, {});
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } 
    catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectdb;