const express = require("express");
const ReviewController = require("../controllers/review.js");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedin, isOwner } = require("../middleware.js");
router.post("/", wrapAsync(ReviewController.postReview));

router.delete(
  "/:reviewId",
  isLoggedin,
  isOwner,
  wrapAsync(ReviewController.deleteReview)
);
module.exports = router;
