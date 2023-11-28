require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const connectDb = require("./src/db/connect");

app.get("/", (req, res) => {
  res.send("my homepage");
});

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
