const mongoose = require('mongoose')
require('dotenv').config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB connected successfully');
    } catch (error) {
        console.log('error while connecting to the database', error);
    }
}
module.exports = {connectDB} 