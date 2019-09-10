const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const bcrypt = require("bcrypt");
const userModel = require("./model/user");
const db = require("./config/database");
const saltRounds = 3;
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = http.createServer(app);

/** sends registerUser.html file from the public folder to the user */
app.get("/sign-up", (request, response) => {
  response.sendFile(path.resolve("public/signUp.html"));
});

/**sends loginUser.html file from the public folder to the user */
app.get("/sign-in", (request, response) => {
  response.sendFile(path.resolve("public/signIn.html"));
});

/**using bcrypt to hash the user's password and store in the mongodb database */
app.post("/register", (request, response) => {
  let body = request.body;
  bcrypt.hash(body.password, saltRounds, function (err, hash) {
    if (err) {
      console.log(err);
    }
    const newUser = new userModel({
      username: body.username,
      password: hash
    });
    newUser.save();
    console.log(newUser);
    response.send("<h1>Registration Successful</h1>");
  });
});

/**collects the user's data, finds the user in the db, compare user password with db password*/
app.post("/login", (request, response) => {
  console.log(request.body);
  async function login() {
    const user = await userModel.findOne({ username: request.body.username });
    await bcrypt.compare(request.body.password, user.password).then(loginMatch => {
      if (loginMatch) {
        response.send("Welcome Back!!!");
      } else {
        response.sendStatus(404);
      }
    });
  }
  login();
});

/**listens to port and calls the database function db() */
server.listen(port, () => {
  console.log(`server is listening at port ${port}`);
  db();
});
