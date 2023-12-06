require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const connectDb = require("./src/db/connect");
const notFoundMiddleware = require("./src/middlewares/notFound");
const errorhandlerMiddleware = require("./src/middlewares/errorHandler");
const authRoute = require("./src/routes/authRoutes");
const userRoute = require("./src/routes/userRoute");
const productRoute = require("./src/routes/productRoutes");
const reviewRoute = require("./src/routes/reviewRoutes");

//middlewares
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET)); //signed cookies
app.use(fileUpload());

app.get("/", (req, res) => {
  console.log("heres your token:", req.signedCookies);
  res.send("my homepage");
});

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/reviews", reviewRoute);

app.use(notFoundMiddleware);
app.use(errorhandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async function () {
  try {
    await connectDb(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`server is live on port:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
