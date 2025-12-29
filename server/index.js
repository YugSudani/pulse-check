const dotenv = require("dotenv");
dotenv.config();
const express = require('express')
const app = express();
const connectDB = require("./connection");
const PORT = process.env.PORT 
const cookieParser = require("cookie-parser");
const cors = require("cors");
const auth = require("./middlewares/auth");

app.use(cors({
    origin: process.env.frontend_url,   
    credentials: true                 
}));

app.use(express.json());
app.use(cookieParser());


const mongo_uri = process.env.MONGO_URI;
connectDB(mongo_uri);

const userRouter = require('./routes/userRouter');
const monitorRouter = require("./routes/monitorRouter");
const incidentRouter = require("./routes/incidentRouter");

app.use('/user', userRouter);
app.use('/monitor', auth, monitorRouter);
app.use('/incident' , auth, incidentRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
