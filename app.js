require("dotenv").config();
const express = require("express");
const path = require("path");
const passport = require("passport");
const mongoose = require("mongoose");
const Listings = require("./model/listing");
const Users = require("./model/user.js");
const Reviews = require("./model/review.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const app = express();
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js");
const LocalStrategy = require("passport-local");

const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);
const dbName = "FoodOrbit";
const dbUrl = process.env.ATLASDB_URL;

main()
  .then((res) => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl, {
    dbName: dbName, // Specify the name of the database you want to use
  });
}
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
let sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    htmlOnly: true,
  },
};
store.on("error", () => {
  console.log("Error in Mongo Store", err);
});

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

app.use(async (req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  if (req.user) {
    let userOrders = await req.user.populate("orders");
    res.locals.userOrders = userOrders.orders; // Assuming you want to pass the orders array to the view
    console.log(userOrders);
  }
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/review", reviews);
app.use("/", users);
app.get("/", async (req, res) => {
  let allListings = await Listings.find();
  res.render("pages/index.ejs", { allListings });
});

app.use((err, req, res, next) => {
  console.log(err);
  next(err); // Pass error to the next middleware
});

// Error handler middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Internal Server Error" } = err;
  if (!err.statusCode) {
    console.error(err.stack);
  }
  res.status(statusCode).render("../error.ejs", { statusCode, message });
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});

app.listen(1010, (req, res) => {
  console.log("Server Live");
});
