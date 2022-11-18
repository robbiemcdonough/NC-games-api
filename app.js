const express = require("express");
const app = express();

const {
  getCategories,
  getReviews,
  getReviewsByID,
  getCommentsByReviewID,
  postCommentsByReviewID,
  patchVotesByReviewID,
} = require("./controllers/controller");

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewsByID);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewID);

app.post("/api/reviews/:review_id/comments", postCommentsByReviewID);

// app.patch('/api/reviews/:review_id', patchVotesByReviewID)

app.use((err, req, res, next) => {
  if (err.code === "23503" && err.detail.includes("reviews")) {
    res.status(404).send({ msg: "review_id is not found" });
  }
  if (err.code === "23503") {
    res.status(400).send({ msg: "invalid username" });
  } else {
    next(err);
  }
});

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
