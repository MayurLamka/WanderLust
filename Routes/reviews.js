const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync.js");

const { validateReview, isLoggedIn, isReviewAuthor, saveRedirectUrl } = require("../middleware.js");
const reviewController = require("../controllers/reviewController.js")


//create Reviews Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Reviews rout
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, saveRedirectUrl, wrapAsync(reviewController.deleteReview));

module.exports = router;    