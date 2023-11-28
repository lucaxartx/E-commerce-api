require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const morgan = require("morgan");
const connectDb = require("./src/db/connect");
const notFoundMiddleware = require("./src/middlewares/notFound");

//middlewares
app.use(morgan("tiny"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("my homepage");
});

app.use(notFoundMiddleware);

const port = process.env.PORT || 3000;

const start = async function () {
  try {
    // await connectDb(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`server is live on port:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
