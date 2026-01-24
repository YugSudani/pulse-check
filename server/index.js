const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const connectDB = require("./connection");
const PORT = process.env.PORT;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const auth = require("./middlewares/auth");
const passport = require("./config/passport");

app.use(passport.initialize());

app.use(
  cors({
    origin: process.env.frontend_url ,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const mongo_uri = process.env.MONGO_URI;
connectDB(mongo_uri);

const userRouter = require("./routes/userRouter");
const monitorRouter = require("./routes/monitorRouter");
const incidentRouter = require("./routes/incidentRouter");
const aiRouter = require("./routes/AiRouter");
const stripe = require("./routes/stripe"); //create checkout session
const stripeW = require("./routes/stripeWebhook"); //webhook
app.use("/user", userRouter);
app.use("/monitor", auth, monitorRouter);
app.use("/incident", auth, incidentRouter);
app.use("/ai", auth, aiRouter);
app.use("/stripe", stripe );
app.use("/stripe", stripeW);
app.use("/auth", require("./routes/auth"));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

require("./workers/monitorWorker")().then(() => {
  console.log("Monitor Worker started");
}).catch((err) => {
  console.error("Error starting Monitor Worker:", err);
});