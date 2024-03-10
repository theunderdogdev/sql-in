const { Router } = require("express");

const dbInstance = require("../connection");
const ApiResponse = require("../utils/ApiResponse");
const { compareSync, hashSync } = require("bcrypt");

const insecAuthRouter = Router();

insecAuthRouter.post("/register", (req, res) => {
  const { name, username, password, email } = req.body;
  const id = crypto.randomUUID();
  dbInstance.exec(`insert into 'users' (userid, username, email, password, full_name) values ('${id}', '${username}', '${email}', '${hashSync(password, 5)}', '${name}')`, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ msg: "Failed to register" });
    }
    return res.status(201).json({ msg: "Inserted user " + username });
  });
});

insecAuthRouter.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(`select userid, username, password from users where username = ${username}`);
  dbInstance.get(`select userid, username, password from users where username = ${username}`, (err, row) => {
    if (err) {
      console.log(err);
      return res.status(500).json(new ApiResponse({ statusCode: 500, message: "Login Failed" }));
    }
    console.log(row);
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
    } else {
      return res.status(404).json(new ApiResponse({ message: `Invalid credentials for: ${row.username}`, statusCode: 404 }));
    }
  });
});
module.exports = insecAuthRouter;
