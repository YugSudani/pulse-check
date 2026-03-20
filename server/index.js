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
const logger = require("./config/logger");

app.use(passport.initialize());

app.use(
  cors({
    origin: process.env.frontend_url,
    credentials: true,
  }),
);

// Mount Stripe webhook BEFORE express.json() to preserve raw body for signature verification
const stripeW = require("./routes/stripeWebhook");
app.use("/stripe", stripeW);

app.use(express.json());
app.use(cookieParser());

const mongo_uri = process.env.MONGO_URI;
connectDB(mongo_uri);

const userRouter = require("./routes/userRouter");
const monitorRouter = require("./routes/monitorRouter");
const incidentRouter = require("./routes/incidentRouter");
const aiRouter = require("./routes/AiRouter");
const stripe = require("./routes/stripe"); //create checkout session
const adminOnly = require("./middlewares/adminOnly");
const isBlocked = require("./middlewares/isBlocked");

app.use("/user", userRouter);
app.use("/monitor", auth, isBlocked, monitorRouter);
app.use("/incident", auth, isBlocked, incidentRouter);
app.use("/ai", auth, isBlocked, aiRouter);
app.use("/stripe", stripe);
app.use("/auth", require("./routes/auth"));
app.use("/admin", auth, adminOnly, require("./routes/adminRouter"));

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

require("./workers/monitorWorker")()
  .then(() => {
    logger.info("Monitor Worker started");
  })
  .catch((err) => {
    logger.error("Error starting Monitor Worker:", { error: err });
  });
