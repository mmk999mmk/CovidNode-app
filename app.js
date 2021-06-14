const path = require("path");
const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
app.use(express.json());
let db;

const func = async () => {
  db = await open({
    filename: path.join(__dirname, "covid19IndiaPortal.db"),
    driver: sqlite3.Database,
  });
  app.listen(3000, () => {
    console.log("server started");
  });
};

func();

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const que = `select * from user where username='${username}';`;
  const res = await db.get(que);
  if (res === undefined) {
    response.status(400);
    console.log("Invalid user");
    response.send("Invalid user");
  } else {
    const comp = await bcrypt.compare(password, res.password);
    if (comp) {
      const jwtToken = jwt.sign({ username }, "SECRET");
      console.log(jwtToken);
      response.send({ jwtToken });
    } else {
      response.status(400);
      console.log("Invalid password");
      response.send("Invalid password");
    }
  }
});

app.get("/states", async (request, response) => {
  const que = `select * from state;`;
  const res = await db.all(que);
  console.log(res);
  response.send(res);
});

app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;
  const que = `select * from state where state_id=${stateId};`;
  const res = await db.get(que);
  console.log(res);
  response.send(res);
});
