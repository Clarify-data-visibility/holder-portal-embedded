const express = require("express");
const app = express();

app.use(express.json());

const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "ecommerce",
  },
});

app.get("/", (req, res) => {
  return res.send("hello world");
});

app.post("/contact", async (req, res) => {
  console.log(req.body);

  const { name, email, phone, cpf } = req.body;

  await knex("users").insert({ name, email, phone, cpf });

  return res.send({ name, email, phone, cpf });
});

app.listen(3001);
