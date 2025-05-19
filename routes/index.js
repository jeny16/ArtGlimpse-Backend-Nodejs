const express = require("express");

const authRouter = require("./auth");
const productRouter  = require("./product");
const categoryRouter = require("./category");   

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
    ];

    
    defaultRoutes.forEach((route) => {
      router.use(route.path, route.route);
    });
    

  module.exports = router;
