const { Router } = require("express");
const { hashSync, compareSync } = require("bcrypt");

const dbInstance = require("../connection");
const ApiResponse = require("../utils/ApiResponse");

const authRouter = Router();

authRouter.post("/register", (req, res) => {
  const { name, username, password, email } = req.body;
  const id = crypto.randomUUID();
  dbInstance.run(
    "insert into 'users' (userid, username, password, full_name, email) values ($userId, $username, $pass, $name, $email)",
    {
      $userId: id,
      $username: username,
      $pass: hashSync(password, 5),
      $name: name,
      $email: email,
    },
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "Failed to register" });
      }
      return res.status(201).json({ msg: "Inserted user " + $username });
    }
  );
});

authRouter.post("/login", (req, res) => {
  const { username, password } = req.body;
  dbInstance.get("select userid, username, password from users where username = $username", { $username: username }, (err, row) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ msg: "Failed to login" });
    }
    console.log(req.session);
    if (compareSync(password, row.password)) {
      if (!req.session.userId) {
        req.session.userId = row.userid;
        req.session.save((err) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("Saved session: ");
          console.log(req.session, req.sessionID);
        });
        return res.status(200).json(new ApiResponse({ statusCode: 200, message: "Login Successful" }));
      }
      return res.status(200).json(
        new ApiResponse({
          statusCode: 302,
          message: "Redirect to todos",
          data: {
            url: "/todos",
          },
        })
      );
    }
    return res.status(401).json({ msg: "Invalid login attempt" });
  });
});
module.exports = authRouter;
