const Users = require("../model/user.js");

module.exports.loginPage = (req, res) => {
  res.render("user/login.ejs");
};
module.exports.cart = async (req, res) => {
  let user = req.user;
  let { orders: userOrders } = await user.populate("orders");

  // console.log(userOrders);
  // console.log(user);
  res.render("user/cart.ejs", { userOrders });
};
module.exports.cartDelete = async (req, res) => {
  let { orderId } = req.params;
  let userId = req.user.id;
  // console.log(Users.findById(userId));
  // console.log(Users.findById(userId, { orders: orderId }));

  await Users.findByIdAndUpdate(userId, { $pull: { orders: orderId } });
  res.redirect(`/cart`);
};
module.exports.orderConfirm = (req, res) => {
  res.render("pages/ordered.ejs");
};
module.exports.checkout = async (req, res) => {
  req.flash("success", "Order Placed ✅");
  let user = req.user.id;
  await Users.updateOne({ _id: user }, { $set: { orders: [] } });
  res.redirect("/listings");
};
module.exports.signupPage = (req, res) => {
  res.render("user/signup.ejs");
};
module.exports.register = async (req, res) => {
  try {
    let { email, username, password } = req.body;
    let newUser = new Users({
      username: username,
      email: email,
    });

    let logged = await Users.register(newUser, password);
    // console.log(logged);
    // req.flash("success", "Registered");
    req.login(logged, (err, next) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User Registered");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    console.log(e.message);
    res.redirect("/signup");
  }
};
module.exports.login = (req, res) => {
  req.flash("success", "Logged in!");
  let redirectUrl = res.locals.redirect || "/";

  res.redirect(redirectUrl);
};
module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out!");
    return res.redirect("/listings");
  });
};
