const express = require("express");
const app = express();
const {
  getCategories,
  getReviews,
  getReviewsByID,
  getCommentsByReviewID,
} = require("./controllers/controller");

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewsByID);
app.get('/api/reviews/:review_id/comments', getCommentsByReviewID)

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
app.get("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
  next();
});

module.exports = app;
