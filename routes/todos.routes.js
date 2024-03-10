const { Router } = require("express");
const { checkSession } = require("../middlewares/checksession");
const dbInstance = require("../connection");
const ApiResponse = require("../utils/ApiResponse");

const todosRouter = Router();

todosRouter.get("/", checkSession, (req, res) => {
  dbInstance.all(`select todo_id, description, doc, completed from todos where owner = $userid`, { $userid: req.userId }, (err, rows) => {
    if (err) {
      return res.status(500).json(
        new ApiResponse({
          message: "Couldn't fetch todos",
          statusCode: 500,
        })
      );
    }
    rows = rows.map((row) => {
      row.completed = Boolean(row.completed);
      return row;
    });
    return res.status(200).json(
      new ApiResponse({
        message: "ok",
        data: {
          todos: rows,
        },
        statusCode: 200,
      })
    );
  });
});

todosRouter.get("/filter", checkSession, (req, res) => {
  const title = req.query.title;
  dbInstance.all("select todo_id, description, doc, completed from todos where owner = $userid and description like $q", { $userid: req.userId, $q: `%${title}%` }, (err, rows) => {
    if (err) {
      console.log(err);
    }
    console.log(rows);
  });
  res.json(
    new ApiResponse({
      message: "ok",
      statusCode: 200,
    })
  );
});

todosRouter.post("/add", checkSession, (req, res) => {
  const { description, doc } = req.body;
  const id = crypto.randomUUID();
  dbInstance.run(
    "insert into todos (todo_id, description, completed, doc, owner) values  ($todoId, $desc, $completed, $doc, $owner)",
    {
      $todoId: id,
      $desc: description,
      $completed: false,
      $doc: doc,
      $owner: req.userId,
    },
    (err) => {
      if (err) {
        return res.status(500).json(new ApiResponse({ message: "Couldn't add todo", statusCode: 500 }));
      }
      return res.status(201).json(
        new ApiResponse({
          message: "Added todo successfully",
          statusCode: 201,
          data: {
            todo: {
              todo_id: id,
              description: description,
              completed: false,
              doc: doc,
            },
          },
        })
      );
    }
  );
});

todosRouter.patch("/update", checkSession, (req, res) => {
  const { todo_id, description, completed, doc } = req.body;
  dbInstance.run(
    "update todos set completed = $completed where todo_id = $todoId",
    {
      $completed: completed,
      $todoId: todo_id,
    },
    (err) => {
      if (err) {
        return res.status(500).json(new ApiResponse({ message: "Couldn't update todo", statusCode: 500 }));
      }
      return res.status(200).json(
        new ApiResponse({
          message: "Update todo successfully",
          statusCode: 200,
          data: {
            todo: {
              todo_id,
              description,
              completed,
              doc,
            },
          },
        })
      );
    }
  );
});

module.exports = todosRouter;
