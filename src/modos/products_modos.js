import fs from "fs";
import path from "path";
import config from "../config.js";
import { Socket } from "socket.io";

const upath = path.join(config.DIRNAME, "../src/jsons/products.json");

let products = JSON.parse(fs.readFileSync(upath, "utf-8"));

export const productsModos = {
  getProducts: async (req, res) => {
    const limit = req.query.limit;

    if (limit) {
      if (limit >= products.length) {
        res.status(200).send(await { ...products });
      } else {
        let newArraylimit1 = await JSON.parse(fs.readFileSync(upath, "utf-8"));
        newArraylimit1.splice(0, newArraylimit1.length - limit);
        res.status(200).send(await { ...newArraylimit1 });
      }
    } else {
      res.status(200).send(await { ...products });
    }
  },

  getProductsById: async (req, res) => {
    const id = req.params.pid;
    const objectById = await products[id];
    if (objectById) {
      res.send(await products[id]);
    } else {
      res.send("<h1>Error!! Producto no encontrado</h1>");
    }
  },

  addProduct: (req, res) => {
    let id;
    const socketServer = req.app.get("socketServer");

    products.length < 1 ? (id = -1) : (id = products.length - 1);

    const product = {
      id: id + 1,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      thumbnail: req.body.thumbnail || [],
      code: req.body.code,
      stock: req.body.stock,
      status: true,
      category: req.body.category,
    };
    const completeSpace = Object.values(product).includes(undefined);
    const codeExiste = products.some(
      (element) => element.code === product.code
    );
    if (completeSpace) {
      res
        .status(400)
        .send({ payload: [], error: "Todos los campos solicitados" });
    } else if (codeExiste) {
      res.status(400).send({ payload: [], error: "El codigo ya existe" });
    } else {
      products.push(product);
      fs.writeFileSync(upath, JSON.stringify(products));
      res.status(200).send(products);

      socketServer.emit("upGradeProducts", products);
    }
  },

  upDateProduct: (req, res) => {
    const id = +req.params.pid;
    const product = {
      id: id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      thumbnail: req.body.thumbnail || [],
      code: req.body.code,
      stock: req.body.stock,
      status: true,
      category: req.body.category,
    };

    const getProducts = products;
    const upgrateArray = getProducts.filter((element) => element.id !== id);
    const completeSpace = Object.values(product).includes(undefined);
    const sameCode = upgrateArray.some(
      (elemet) => product.code === elemet.code
    );
    if (sameCode) {
      res.status(400).send({ payload: [], error: "El codigo ya existe" });
    } else if (completeSpace) {
      res
        .status(400)
        .send({ payload: [], error: "Complete todos los espacios" });
    } else {
      products.splice(id, 1, product);
      fs.writeFileSync(upath, JSON.stringify(products));
      res.status(200).send("producto actualizado");
    }
  },
  deleteProduct: (req, res) => {
    const id = +req.params.pid;
    const socketServer = req.app.get("socketServer");
    const getProducts = products;
    const upgrateArray = getProducts.filter((element) => element.id !== id);

    if (getProducts.length === upgrateArray.length) {
      res.status(400).send({ payload: [], error: "Producto no encontrado" });
    } else {
      products = [...upgrateArray];
      fs.writeFileSync(upath, JSON.stringify(products));
      res.status(200).send("Producto eliminado");

      socketServer.emit("upGradeProducts", products);
    }
  },
};
