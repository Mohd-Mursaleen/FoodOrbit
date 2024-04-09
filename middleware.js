const Reviews = require("./model/review.js");

// Middleware to check if the user is logged in
module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You are not logged in!");
    return res.redirect("/login");
  }
  // req.session.redirectUrl = req.originalUrl; // Moved to the else block to avoid redundancy
  next();
};

// Middleware to check if the user is the owner of a review
module.exports.isOwner = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    const review = await Reviews.findById(reviewId);

    if (!review.author._id.equals(req.user._id)) {
      req.flash("error", "You don't have permission");
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (error) {
    console.error("Error in isOwner middleware:", error);
    req.flash("error", "Something went wrong");
    res.redirect("back");
  }
};

// Middleware to save redirect URL in session
module.exports.isSaveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirect = req.session.redirectUrl;
    // console.log(req.session.redirectUrl);
  }
  next();
};
