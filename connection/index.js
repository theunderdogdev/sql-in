const sql3 = require("sqlite3").verbose();

const dbInstance = new sql3.Database("./databases/todo.db", (err) => {
  if (err) {
    console.log(err.message);
    return;
  }
  // Creating users table
  dbInstance.run(
    "CREATE TABLE if not exists users(userid varchar(36) primary key, username varchar(20) unique, password char(60), full_name varchar(40), email varchar(60) unique);",
    (err) => {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log("Users table created successfully");
    }
  );
  // Creating todos table
  dbInstance.run(
    "CREATE TABLE if not exists todos(todo_id varchar(36) primary key, description varchar(257), completed boolean, doc datetime, owner varchar(36), FOREIGN KEY(owner) REFERENCES users(userid));", (err)=>{
      if(err){
        console.log(err.message);
        return
      }
      console.log("Todos table created")
    }
  );

});

module.exports = dbInstance;
