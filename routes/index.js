const express = require("express");

const authRouter = require("./auth");
const productRouter = require("./product");
const categoryRouter = require("./category");
const wishlistRouter = require("./wishlist");
const cartRouter = require('./cart')
const paymentRouter = require('./payment')
const validateRouter = require("./validate");
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
    route: paymentRouter
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
