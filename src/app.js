import express from "express";
import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/cart.routes.js";
import config from "./config.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.listen(config.PORT, () => {
  console.log(`Puerto ${config.PORT} escuchando`);
});
