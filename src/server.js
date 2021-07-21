const express = require("express");
const cookieParser = require("cookie-parser");
const appRouter = require("./routers/app.router");
const authRouter = require("./routers/auth.router");
const enums = require("./enums");
const configs = require("./configs");
const cors = require("cors");
const mongoose = require("mongoose");

const db = configs.get(process.env.NODE_ENV);
const corsConfig = {
  origin: true,
  credentials: true,
};

const app = express();
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

mongoose.Promise = global.Promise;
mongoose.connect(
  db.DATABASE,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(`${enums.errs.DB_NOT_CONNECT} ${err}`);
      return;
    }
    console.log(enums.msgs.DB_CONNECT);
  }
);

app.use("/", appRouter);
app.use("/dashboard-api/auth", authRouter);

const port = process.env.PORT || 1039;
app.listen(port, () => console.log(`${enums.msgs.SERVER_CONNECT} ${port}`));
