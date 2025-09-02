const express = require("express");

const authRouter = require("./auth");
const productRouter = require("./product");
const categoryRouter = require("./category");
const wishlistRouter = require("./wishlist");
const cartRouter = require("./cart");
const paymentRouter = require("./payment");
const validateRouter = require("./validate");
const orderRouter = require("./order");

// Import your new user‐profile routes
const userRouter = require("./user");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/products",
    route: productRouter,
  },
  {
    path: "/categories",
    route: categoryRouter,
  },
  {
    path: "/wishlist",
    route: wishlistRouter,
  },
  {
    path: "/cart",
    route: cartRouter,
  },
  {
    path: "/validate",
    route: validateRouter,
  },
  {
    path: "/payment",
    route: paymentRouter,
  },
  {
    path: "/user",
    route: userRouter,
  },
  { path: "/orders", route: orderRouter },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
