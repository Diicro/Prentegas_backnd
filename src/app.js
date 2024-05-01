import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/cart.routes.js";
import viewsRoutes from "./routes/views.routes.js";
import config from "./config.js";

const app = express();
app.engine("handlebars", handlebars.engine());
app.set("views", `${config.DIRNAME}/views`);
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/views", viewsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
const httpserver = app.listen(config.PORT, () => {
  console.log(`Puerto ${config.PORT} escuchando`);
});

const socketServer = new Server(httpserver);
app.set("socketServer", socketServer);

socketServer.on("connection", (client) => {
  console.log(`Cliente conetado id ${client.id}`);
});
