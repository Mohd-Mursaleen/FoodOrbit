const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { isSaveRedirectUrl, isLoggedin } = require("../middleware.js");
router
  .route("/login")
  .get(UserController.loginPage)
  .post(
    isSaveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      successFlash: true,
      failureRedirect: "/login",
    }),
    UserController.login
  );
router.get("/cart", isLoggedin, wrapAsync(UserController.cart));

router.delete("/cart/:orderId", UserController.cartDelete);
router.get("/order", isLoggedin, UserController.orderConfirm);
router.get("/checkout", isLoggedin, UserController.checkout);
router
  .route("/signup")
  .get(UserController.signupPage)
  .post(UserController.register);

router.get("/logout", UserController.logout);

module.exports = router;
