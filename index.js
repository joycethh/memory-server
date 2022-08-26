// import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

//express app
const app = express();

//middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

//routes
app.use("/posts", postRoutes);
app.use("/user", userRoutes);

//for deployment
app.get("/", (req, res) => {
  res.send("APP IS RUNNING.");
});

const PORT = process.env.PORT;
const URL = process.env.MONGODB_URL;

// //connect to db
mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    //listen for request
    app.listen(PORT, () =>
      console.log(`DB is connected & server running on port: ${PORT}`)
    );
  })
  .catch((error) => {
    console.log(error.message);
  });

// mongoose.set("useFindAndModify", false);
