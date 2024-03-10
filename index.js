const express = require("express");
// const { checkSession } = require("./middlewares/checksession");
const { resolve } = require("path");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const authRouter = require("./routes/auth.routes");
const todosRouter = require("./routes/todos.routes");
const insecAuthRouter = require("./routes/auth.insercure.routes");
const app = express();
app.use(express.json());
app.use("/static", express.static(resolve("./staticfiles")));
app.use(
  session({
    name: "USER_SESSION",
    store: new SQLiteStore({
      db: "./databases/session.db",
      table: "sessions",
      concurrentDB: true,
    }),
    resave: false,
    saveUninitialized: false,
    secret: "HelloW!2ks&802",
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 2700000,
    },
  })
);

app.get("/", (req, res) => {
  res.sendFile(resolve("./staticfiles/views/index.html"));
});

app.use("/api/auth", authRouter);
app.use('/api/insecure/auth', insecAuthRouter)
app.use('/api/todos', todosRouter);
app.listen(4100, () => {
  console.log("http://localhost:4100/");
});
