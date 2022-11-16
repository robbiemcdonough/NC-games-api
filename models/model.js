const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query("SELECT * FROM categories").then((result) => result.rows);
};

exports.fetchReviews = () => {
  return db
    .query(
      "SELECT reviews.*, COUNT(comments.comment_id)::INT AS comment_count FROM REVIEWS LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY created_at DESC"
    )
    .then((result) => result.rows);
};
