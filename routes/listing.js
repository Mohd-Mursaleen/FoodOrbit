const express = require("express");
const ListingController = require("../controllers/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedin, isSaveRedirectUrl } = require("../middleware.js");
const router = express.Router({ mergeParams: true });

//Index Page

router.get("/", wrapAsync(ListingController.homepage));
router.get("/filter/:types", wrapAsync(ListingController.filter));

//Show page
router.get("/:id", wrapAsync(ListingController.showpage));
router.post(
  "/:id/buy",
  isLoggedin,

  wrapAsync(ListingController.buy)
);
//Add to cart
router.post(
  "/:id",
  isLoggedin,
  isSaveRedirectUrl,
  wrapAsync(ListingController.addCart)
);

module.exports = router;
