const express = require("express");

const authRouter = require("./auth");
const productRouter = require("./product");
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
  ];

  
  defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
  

module.exports = router;
