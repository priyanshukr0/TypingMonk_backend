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

const corsOrigin = process.env.CORS_ORIGIN;
// using middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: corsOrigin,
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

