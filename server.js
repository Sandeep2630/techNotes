require("dotenv").config();
const express = require("express");
const connnectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const { logger } = require("./middleware/logger");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { logEvents } = require("./middleware/logger");
const path = require("path");
const corsOptions = require("./config/corsOptions");
const app = express();

const PORT = process.env.PORT || 3500;
connnectDb();
app.use(logger);

app.use(express.json());

app.use(cors(corsOptions));

app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});
app.use(errorHandler);
mongoose.connection.once("open", () => {
  console.log("connected to mongodb");
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
