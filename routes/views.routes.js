const { Router } = require("express");
const { checkSession } = require("../middlewares/checksession");
const { resolve } = require("path");
const viewsRouter = Router();
viewsRouter.get("/login", (req, res) => {
  res.sendFile(resolve("./views/login.html"));
});
viewsRouter.get("/register", (req, res) => {
  res.sendFile(resolve("./views/register.html"));
});

viewsRouter.get("/todos", checkSession, (req, res) => {
  res.sendFile(resolve("./views/todos.html"));
});
module.exports = viewsRouter;
