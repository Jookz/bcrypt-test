const express = require("express");
const bcrypt = require("bcrypt");

const app = express();

app.listen(3000);

app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(salt);
    console.log(hashedPassword);
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.email === req.body.email);
  if (user === null)
    return res.status(404).send({ Response: "User not found" });
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Great success, very nice!!");
    } else {
      res.send("Poopy, no matchy matchy");
    }
  } catch {
    res.status(500).send();
  }
});
