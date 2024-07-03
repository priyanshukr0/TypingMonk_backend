const express = require('express');
const { connectDB } = require('./config/mongDB');
const app = express();
const cookieParser = require("cookie-parser");
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const authRoutes = require('./routes/authRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const textDataRoutes = require("./routes/textDataRoute");
const cors = require("cors");

const allowedOrigins = process.env.CORS_ORIGIN.split(',');
// using middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: function (origin, callback) {
        // Check if the origin is in the allowed list
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            // If yes, allow the request
            callback(null, true);
        } else {
            // If no, block the request
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

connectDB(); //database
// welcome route
app.get('/', (req, res) => {
    res.send('welcome to the api');
})
//using the routes 
app.use('/api', scoreRoutes);
app.use('/api', authRoutes);
app.use('/api', textDataRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

