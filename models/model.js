const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query("SELECT * FROM categories").then((result) => result.rows);
};

exports.fetchReviews = () => {
  return db
    .query(
      "SELECT reviews.*, COUNT(comments.comment_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY created_at DESC"
    )
    .then((result) => result.rows);
};

exports.fetchReviewsByID = (review_id) => {
  if (isNaN(review_id)) {
    return Promise.reject({ status: 400, msg: "review_id is not a number" });
  }
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "review_id is not found" });
      } else {
        return result.rows[0];
      }
    });
};

exports.fetchCommentsByReviewID = (review_id) => {
  if (isNaN(review_id)) {
    return Promise.reject({ status: 400, msg: "review_id is not a number" });
  }
  return db
    .query(
      "SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC",
      [review_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "review_id is not found" });
      } else {
        return result.rows;
      }
    });
};

exports.insertCommentsByReviewID = (newComment, review_id) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [newComment.username])
    .then((array) => {
      if (array.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "invalid username" });
      } else {
        return db
          .query(
            "INSERT INTO comments (body, review_id, author) VALUES ($1, $2, $3) RETURNING *;",
            [newComment.body, review_id, newComment.username]
          )
          .then((result) => {
            if(newComment.body.length === 0) {
              return Promise.reject({status: 404, msg: 'comment body not found'})
            }
            return result.rows[0];
          });
      }
    });
};
