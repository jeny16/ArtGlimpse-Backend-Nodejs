const express = require("express");

const authRouter = require("./auth");
const productRouter = require("./product");
const categoryRouter = require("./category");
const wishlistRouter = require("./wishlist");
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
    path: "/validate",
    route: validateRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
