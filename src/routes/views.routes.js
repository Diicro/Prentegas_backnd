import { Router } from "express";
import config from "../config.js";
import fs from "fs";
import path from "path";

const routes = Router();
const products = JSON.parse(
  fs.readFileSync(
    path.join(config.DIRNAME, "../src/jsons/products.json"),
    "utf-8"
  )
);
const allProducts = { products: products };

routes.get("/", (req, res) => {
  res.render("home", allProducts);
});

routes.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", allProducts);
});

export default routes;
