const Reviews = require("../model/review.js");
const Listings = require("../model/listing.js");
module.exports.postReview = async (req, res) => {
  let listing = await Listings.findById(req.params.id);
  let newReview = new Reviews(req.body.review);
  console.log(listing);
  console.log(req.params);
  console.log(req.user);
  let author = req.user;
  newReview.author = author;

  listing.reviews.push(newReview._id);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${req.params.id}`);
};
module.exports.deleteReview = async (req, res) => {
  let { id } = req.params;
  let { reviewId } = req.params;
  await Reviews.findByIdAndDelete(req.params.reviewId);

  await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  res.redirect(`/listings/${id}`);
};
