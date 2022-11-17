const express = require("express");
const app = express();
const { getCategories, getReviews } = require("./controllers/controller");

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);

app.get("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
  next()
});
module.exports = app;
