const {
  fetchCategories,
  fetchReviews,
  fetchReviewsByID,
  fetchCommentsByReviewID,
  insertCommentsByReviewID,
  updateVotesByReviewID,
} = require("../models/model");

exports.getCategories = (req, res, next) => {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviews = (req, res, next) => {
  fetchReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.getReviewsByID = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewsByID(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getCommentsByReviewID = (req, res, next) => {
  const { review_id } = req.params;
  fetchCommentsByReviewID(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.postCommentsByReviewID = (req, res, next) => {
  const { review_id } = req.params;
  insertCommentsByReviewID(req.body, review_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotesByReviewID = (req, res, next) => {
  const { review_id } = req.params;
  updateVotesByReviewID(req.body, review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
