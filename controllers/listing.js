const Listings = require("../model/listing");

module.exports.homepage = async (req, res) => {
  let allListings = await Listings.find();
  res.render("pages/all.ejs", { allListings });
};
module.exports.filter = async (req, res) => {
  let { types } = req.params;
  // console.log(types);
  let allListings = await Listings.find({ type: types });
  // console.log(allListings);
  res.render("pages/all.ejs", { allListings });
};
module.exports.showpage = async (req, res) => {
  let { id } = req.params;
  let listing = await Listings.findById(id).populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  });
  //  console.log(listing)
  res.render("pages/show.ejs", { listing });
};
module.exports.buy = async (req, res) => {
  let { id } = req.params;

  let listing = await Listings.findById(id);
  let loggedUser = req.user;

  // Add the listing to the user's orders array
  loggedUser.orders.push(listing);
  await loggedUser.save();

  req.flash("success", "Item bought");
  res.redirect("/cart"); // Redirect to the cart page after buying
};
module.exports.addCart = async (req, res) => {
  let { id } = req.params;

  let listing = await Listings.findById(id);
  // console.log(listing);
  // console.log(req.user.orders);
  let loggedUser = req.user;
  loggedUser.orders.push(listing);
  await loggedUser.save();
  let redirectUrl = res.locals.redirect || `/listings/${id}`;
  let flashMessage = "Added to cart";
  req.flash("success", flashMessage);
  res.redirect(redirectUrl);
};
